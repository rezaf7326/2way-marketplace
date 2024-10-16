import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ConfigTemplate } from './common/config/config-template';
import {
  LoggerConfig,
  GeneralConfig,
  SwaggerConfig,
  PostgresConfig,
} from './common/config/configs';

export class ConfigValidInterface extends ConfigTemplate {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GeneralConfig)
  general: GeneralConfig;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PostgresConfig)
  pg: PostgresConfig;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LoggerConfig)
  logger: LoggerConfig;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SwaggerConfig)
  swagger: SwaggerConfig;
}
