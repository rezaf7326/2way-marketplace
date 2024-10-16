import { IsOptional, IsString } from 'class-validator';

export class SwaggerConfig {
  @IsOptional()
  @IsString()
  path: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  version: string;

  @IsOptional()
  @IsString()
  tag: string;
}
