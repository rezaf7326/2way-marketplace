import { Role, Route } from '../common/enums';
import { Logger } from '../common/logger/logger';
import { NextFunction, Response, Router } from 'express';
import { Bootable, Singleton, ValidRequest } from '../common/abstraction';
import {
  BlockUserRoleMiddleware,
  withAuthenticatedUserMiddleware,
  withQueriesMiddleware,
  WithUserRoleMiddleware,
} from '../middlewares';
import { StaticImplements } from '../common/custom-decorators';
import { ProductService } from '../services/product.service';
import { CreateProductDto, OrderProductDto } from '../dtos';
import { BadRequest } from 'http-errors';

@StaticImplements<Singleton<ProductController>>()
export class ProductController implements Bootable {
  private static instance: ProductController;
  private readonly logger: Logger;

  private constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  static get ref(): ProductController {
    if (!this.instance) {
      this.instance = new ProductController();
    }
    return this.instance;
  }

  async boot(router: Router) {
    this.logger.verbose('registering routes to global router');

    router.get(
      Route.Product,
      withAuthenticatedUserMiddleware(),
      withQueriesMiddleware({
        page: (val: unknown) => (val ? +val > 0 : true),
        size: (val: unknown) => (val ? +val > 0 : true),
        search: () => true,
      }),
      this.find.bind(this),
    );
    this.logger.info(`registered GET ${Route.Product}`);

    router.post(
      Route.ProductListing,
      withAuthenticatedUserMiddleware(),
      WithUserRoleMiddleware(Role.Seller),
      this.create.bind(this),
    );
    this.logger.info(`registered POST ${Route.ProductListing}`);

    router.get(
      Route.ProductListing,
      withAuthenticatedUserMiddleware(),
      BlockUserRoleMiddleware(Role.Buyer),
      withQueriesMiddleware({
        page: (val: unknown) => (val ? +val > 0 : true),
        size: (val: unknown) => (val ? +val > 0 : true),
        search: () => true,
        by: (val: unknown) => (val ? +val > 0 : true), // seller id
      }),
      this.findListings.bind(this),
    );
    this.logger.info(`registered GET ${Route.ProductListing}`);

    router.post(
      Route.ProductOrder,
      withAuthenticatedUserMiddleware(),
      WithUserRoleMiddleware(Role.Buyer),
      this.createOrder.bind(this),
    );
    this.logger.info(`registered POST ${Route.ProductOrder}`);

    router.get(
      Route.ProductOrder,
      withAuthenticatedUserMiddleware(),
      BlockUserRoleMiddleware(Role.Approver),
      withQueriesMiddleware({
        page: (val: unknown) => (val ? +val > 0 : true),
        size: (val: unknown) => (val ? +val > 0 : true),
        search: () => true,
        by: (val: unknown) => (val ? +val > 0 : true), // buyer id (useful for sellers to filter)
      }),
      this.findOrders.bind(this),
    );
    this.logger.info(`registered GET ${Route.ProductOrder}`);
  }

  async find(req: ValidRequest, res: Response, next: NextFunction) {
    this.logger.verbose('find products');
    try {
      const result = await ProductService.ref.find({
        size: req.query.size ? Number(req.query.size) : undefined,
        page: req.query.page ? Number(req.query.page) : undefined,
        search: req.query.search ? (req.query.search as string) : undefined,
      });
      res.status(200).send(result);
      this.logger.info(`found ${result.products.length} products`);
      this.logger.verbose(JSON.stringify(result.metadata));
    } catch (error) {
      next(error);
    }
  }

  async create(
    { body }: ValidRequest<Array<CreateProductDto>>,
    res: Response,
    next: NextFunction,
  ) {
    this.logger.verbose('create products');
    try {
      if (body.some(({ sellerId }) => sellerId !== body[0].sellerId)) {
        throw new BadRequest(
          'invalid listing, all products must have the same sellerId',
        );
      }
      const newProducts = await ProductService.ref.create(body);
      res.status(201).send(newProducts);
      this.logger.info(
        `successfully created ${newProducts.length} new products`,
      );
    } catch (error) {
      next(error);
    }
  }

  async findListings(req: ValidRequest, res: Response, next: NextFunction) {
    this.logger.verbose('find listings');
    // {
    //   size: req.query.size ? Number(req.query.size) : undefined,
    //   page: req.query.page ? Number(req.query.page) : undefined,
    //   search: req.query.search ? (req.query.search as string) : undefined,
    //   by: req.query.by ? Number(req.query.by) : undefined,
    // }
  }

  async createOrder(
    { body }: ValidRequest<Array<OrderProductDto>>,
    res: Response,
    next: NextFunction,
  ) {
    this.logger.verbose('create new order');
  }

  async findOrders(req: ValidRequest, res: Response, next: NextFunction) {
    this.logger.verbose('find orders');
    // {
    //   size: req.query.size ? Number(req.query.size) : undefined,
    //   page: req.query.page ? Number(req.query.page) : undefined,
    //   search: req.query.search ? (req.query.search as string) : undefined,
    //   by: req.query.by ? Number(req.query.by) : undefined,
    // }
  }
}
