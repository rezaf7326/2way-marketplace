import { Bootable, Singleton } from 'src/common/abstraction';
import { StaticImplements } from 'src/common/custom-decorators';
import { Logger } from 'src/common/logger/logger';
import { Sequelize } from 'sequelize-typescript';
import { Order, OrderProduct, Product, User } from './entities';

@StaticImplements<Singleton<Database>>()
export class Database implements Bootable {
  private static instance: Database;
  private readonly logger: Logger;

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
    new Sequelize({
      database: 'your_database',
      dialect: 'postgres',
      username: 'your_username',
      password: 'your_password',
      host: '127.0.0.1',
      models: [User, Product, Order, OrderProduct],
    });
    this.logger.debug('database connected');
  }
}
