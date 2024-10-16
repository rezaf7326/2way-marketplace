import { IsOptional } from 'class-validator';
import {
  GeneralConfig,
  LoggerConfig,
  SwaggerConfig,
  PostgresConfig,
  RabbitMQConfig,
  RedisConfig,
} from './configs';

export class ConfigTemplate {
  @IsOptional()
  general: GeneralConfig;

  @IsOptional()
  pg: PostgresConfig;

  @IsOptional()
  rabbitmq: RabbitMQConfig;

  @IsOptional()
  redis: RedisConfig;

  @IsOptional()
  logger: LoggerConfig;

  @IsOptional()
  swagger: SwaggerConfig;
}
