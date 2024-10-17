import { Op } from 'sequelize';
import { Repository } from 'sequelize-typescript';
import { Product } from '../database/entities';
import { CreateProductDto } from '../dtos';
import { Database } from '../database/database';
import { Logger } from '../common/logger/logger';
import { Singleton } from '../common/abstraction';
import { StaticImplements } from '../common/custom-decorators';
import { Pagination, PaginationMetadata } from '../common/pagination';

@StaticImplements<Singleton<ProductService>>()
export class ProductService {
  private static instance: ProductService;
  private readonly logger: Logger;
  private readonly productRepository: Repository<Product>;

  private constructor() {
    this.logger = new Logger(this.constructor.name);
    this.productRepository = Database.ref.connection.getRepository(Product);
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

  create(list: Array<CreateProductDto>): Promise<Array<Product>> {
    this.logger.debug(`creating products: ${list}`);
    return this.productRepository.bulkCreate(list);
  }
}
