import {
  format,
  transports,
  createLogger,
  Logger as WinstonLogger,
} from 'winston';
import { ConfigContainer } from '../config';

export class Logger {
  private readonly logger: WinstonLogger;

  constructor(label?: string) {
    const config = ConfigContainer.config().logger;
    this.logger = createLogger({
      transports: [
        new transports.Console({
          level: config.level,
          format: format.combine(
            format.timestamp(),
            format.ms(),
            format.printf(
              (info) =>
                `${config.name ? `[${config.name}] ` : ''}` +
                `${info.level} ${info.timestamp}` +
                `${label ? ` [${label}]` : ''}: ` +
                `${info.message} ${info.ms}`,
            ),
            format.colorize({ all: true }),
          ),
        }),
      ],
    });
  }

  error(message: any) {
    this.logger.log('error', message);
  }

  warn(message: any) {
    this.logger.log('warn', message);
  }

  info(message: any) {
    this.logger.log('info', message);
  }

  verbose(message: any) {
    this.logger.log('verbose', message);
  }

  debug(message: any) {
    this.logger.log('debug', message);
  }

  silly(message: any) {
    this.logger.log('silly', message);
  }
}
