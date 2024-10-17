import 'reflect-metadata'; // required for the migrator
import { SequelizeOptions } from 'sequelize-typescript';
import { ConfigContainer } from '../common/config';
import { ConfigValidInterface } from '../config-valid.interface';

ConfigContainer.config(ConfigValidInterface); // validate .env

const Config: SequelizeOptions = {
  dialect: 'postgres',
  database: ConfigContainer.config().pg.database,
  username: ConfigContainer.config().pg.username,
  password: ConfigContainer.config().pg.password,
  host: ConfigContainer.config().pg.host,
  port: ConfigContainer.config().pg.port,
};

module.exports = Config; // required for the migrator
