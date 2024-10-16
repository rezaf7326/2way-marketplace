import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Environment } from '../../enums';

export class GeneralConfig {
  @IsDefined()
  @IsEnum(Environment)
  env: Environment;

  @IsDefined()
  @IsNumber()
  port = 3000;

  @IsOptional()
  @IsString()
  globalPrefix: string;

  @IsOptional()
  @IsString()
  apiVersion: string;

  @IsOptional()
  @IsBoolean()
  isTls: boolean;

  @IsOptional()
  @IsString()
  tlsCa: string;

  @IsOptional()
  @IsString()
  tlsCert: string;

  @IsOptional()
  @IsString()
  tlsKey: string;

  @IsOptional()
  @IsString()
  jwtSecret: string;

  @IsOptional()
  @IsString()
  apiKey: string;

  @IsOptional()
  @IsString()
  encKey: string;

  @IsOptional()
  @IsNumber()
  accessExpHours: number;

  @IsOptional()
  @IsNumber()
  refreshExpHours: number;
}
