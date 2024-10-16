import { IsOptional } from 'class-validator';
import {
  GeneralConfig,
  LoggerConfig,
  PostgresConfig,
  SwaggerConfig,
} from './configs';

export class ConfigTemplate {
  @IsOptional()
  general: GeneralConfig;

  @IsOptional()
  pg: PostgresConfig;

  @IsOptional()
  logger: LoggerConfig;

  @IsOptional()
  swagger: SwaggerConfig;
}
