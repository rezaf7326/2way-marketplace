import {
  ClassType,
  transformAndValidateSync,
} from 'class-transformer-validator';
import 'dotenv/config';
import stringify from 'fast-safe-stringify';
import { Environment, LogLevel } from '../enums';
import { ConfigTemplate } from './config-template';

export class ConfigContainer {
  private static _config: any;
  private static notValidated = true;
  private static extraConfig = new Map<string, string>();

  private constructor() {
    /* singleton */
  }

  static config<T extends ConfigTemplate>(validationClass?: ClassType<T>): T {
    if (!this._config) {
      this._config = {
        general: this.generalConfig(),
        logger: this.loggerConfig(),
        swagger: this.swaggerConfig(),
        pg: this.postgresConfig(),
        rabbitmq: this.rabbitmqConfig(),
        redis: this.redisConfig(),
      } as T;
    }
    if (validationClass && this.notValidated) {
      try {
        transformAndValidateSync(validationClass, stringify(this._config), {
          validator: {
            validationError: { target: false, value: false },
          },
        });
      } catch (e) {
        console.error(`Wrong/missing environment variables - ${e}`);
        throw e;
      }
      this.notValidated = false;
    }

    return this._config as T;
  }

  static get(envVariable: string): string {
    if (this.extraConfig.has(envVariable)) {
      return this.extraConfig.get(envVariable);
    }
    const value = process.env[envVariable];
    this.extraConfig.set(envVariable, value);

    return value;
  }

  private static generalConfig(): ConfigTemplate['general'] {
    return {
      env: process.env.GENERAL_ENV as Environment,
      port: Number(process.env.GENERAL_PORT) || 3000,
      apiVersion: process.env.GENERAL_API_VERSION,
      globalPrefix: process.env.GENERAL_GLOBAL_PREFIX,
      isTls: process.env.GENERAL_TLS_ENABLED === 'true',
      tlsCert: process.env.GENERAL_TLS_CERT,
      tlsKey: process.env.GENERAL_TLS_KEY,
      tlsCa: process.env.GENERAL_TLS_CA,
      jwtSecret: process.env.GENERAL_JWT_SEC,
      apiKey: process.env.GENERAL_API_KEY,
      encKey: process.env.GENERAL_ENC_KEY,
      accessExpHours: Number(process.env.GENERAL_JWT_ACCESS_EXP_HOURS) || 1,
      refreshExpHours:
        Number(process.env.GENERAL_JWT_REFRESH_EXP_HOURS) || 2160,
    };
  }

  private static loggerConfig(): ConfigTemplate['logger'] {
    return {
      enable: process.env.LOG_ENABLE === 'true',
      name: process.env.LOG_NAME,
      level: process.env.LOG_LEVEL as LogLevel,
    };
  }
  private static swaggerConfig(): ConfigTemplate['swagger'] {
    return {
      path: process.env.SWAGGER_PATH,
      title: process.env.SWAGGER_TITLE,
      version: process.env.SWAGGER_VERSION,
      tag: process.env.SWAGGER_TAG,
    };
  }

  private static postgresConfig(): ConfigTemplate['pg'] {
    return {
      host: process.env.MARIADB_HOST,
      port: Number(process.env.MARIADB_PORT),
      username: process.env.MARIADB_USERNAME,
      password: process.env.MARIADB_PASSWORD,
      database: process.env.MARIADB_DB_NAME,
    };
  }

  private static rabbitmqConfig(): ConfigTemplate['rabbitmq'] {
    return { url: process.env.RMQ_URL };
  }

  private static redisConfig(): ConfigTemplate['redis'] {
    return { url: process.env.REDIS_URL };
  }
}
