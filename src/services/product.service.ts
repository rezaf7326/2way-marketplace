import { Op } from 'sequelize';
import { Repository } from 'sequelize-typescript';
import { Product } from '../database/entities';
import { CreateProductDto, ListingNotificationMsgDto } from '../dtos';
import { Database } from '../database/database';
import { Logger } from '../common/logger/logger';
import { Singleton } from '../common/abstraction';
import { StaticImplements } from '../common/custom-decorators';
import { Pagination, PaginationMetadata } from '../common/pagination';
import { RabbitMQ } from '../rabbitmq/rabbitmq';
import { ConfigContainer } from '../common/config';
import { RMQEvent } from 'src/common/enums';
import { Listing } from 'src/database/entities/listing.entity';
import { UserService } from './user.service';

@StaticImplements<Singleton<ProductService>>()
export class ProductService {
  private static instance: ProductService;
  private readonly logger: Logger;
  private readonly productRepository: Repository<Product>;
  private readonly listingRepository: Repository<Listing>;

  private constructor() {
    this.logger = new Logger(this.constructor.name);
    this.productRepository = Database.ref.connection.getRepository(Product);
    this.listingRepository = Database.ref.connection.getRepository(Listing);
  }

  static get ref(): ProductService {
    if (!this.instance) {
      this.instance = new ProductService();
    }
    return this.instance;
  }

  async find(options?: {
    page?: number;
    size?: number;
    search?: string;
  }): Promise<{ metadata: PaginationMetadata; products: Array<Product> }> {
    this.logger.debug('find products');
    options = {
      page: options?.page || 1, // default
      size: options?.size || 10, // default
      search: options?.search,
    };
    const queryOptions = {
      limit: options.size,
      offset: (options.page - 1) * options.size,
      where: {},
    };
    if (options.search) {
      queryOptions.where = {
        name: {
          [Op.iLike]: `%${options.search}%`,
        },
      };
    }
    const { rows, count } =
      await this.productRepository.findAndCountAll(queryOptions);
    this.logger.debug(`total number of products: ${count}`);

    return {
      metadata: new Pagination(count, options.page, options.size)
        .paginatedMetadata,
      products: rows,
    };
  }

  async create(list: Array<CreateProductDto>): Promise<Array<Product>> {
    this.logger.debug(`creating products: ${list.map(({ name }) => name)}`);
    const products = await this.productRepository.bulkCreate(list);
    this.logger.verbose(
      `created new products: ${products.map(({ id }) => id)}`,
    );

    // TODO: either REVERT or RETRY if createListing or send over rabbit failed...
    const listing = await this.createListing(products);
    const amqpPayload: ListingNotificationMsgDto = {
      type: 'new',
      listingId: listing.id,
      seller: await UserService.ref.findOne({ id: products[0].sellerId }),
    };
    const sent = RabbitMQ.ref.sendMessage(
      ConfigContainer.get('NOTIFICATION_QUEUE'),
      RMQEvent.Listing,
      amqpPayload,
    );
    if (!sent) {
      this.logger.error(
        `failed to send listing event: ${JSON.stringify(amqpPayload)}`,
      );
    }

    return products.map((product) => {
      product.listingId = listing.id;
      return product;
    });
  }

  async createListing(products: Array<Product>): Promise<Listing> {
    this.logger.debug('creating a new listing');
    const listing = await this.listingRepository.create({
      // sellerId of the products in this array are the same otherwise
      //    there would have been a 400 error at controller layer...
      sellerId: products[0].sellerId,
      products,
    });
    this.logger.verbose(`new listing created: ${listing.id}`);
    const rowsCount = await this.productRepository.update(
      { listingId: listing.id },
      {
        where: {
          id: {
            [Op.in]: products.map(({ id }) => id),
          },
        },
      },
    );
    this.logger.debug(
      `updated ${rowsCount} products with listingId: ${listing.id}`,
    );

    return listing;
  }
}
