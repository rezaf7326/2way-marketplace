import { Bootable, Singleton } from '../common/abstraction';
import { StaticImplements } from '../common/custom-decorators';
import { Logger } from '../common/logger/logger';
import { Sequelize, Model } from 'sequelize-typescript';
import { Order, OrderProduct, Product, User } from './entities';
import { Config } from './config';

@StaticImplements<Singleton<Database>>()
export class Database implements Bootable {
  private static instance: Database;
  private readonly logger: Logger;
  private connection: Sequelize;

  private constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  static get ref(): Database {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }

  async boot() {
    this.logger.info('initializing database connection');
    this.connection = new Sequelize({
      ...Config,
      models: [User, Product, Order, OrderProduct],
    });
    this.logger.debug('database connected');
  }

  repository<T>(model: new () => Model<T>) {
    return this.connection.getRepository(model);
  }
}
