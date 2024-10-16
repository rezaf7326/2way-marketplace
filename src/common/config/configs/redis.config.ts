import { IsDefined, IsString } from 'class-validator';

export class RedisConfig {
  @IsDefined()
  @IsString()
  url: string;

  // @IsDefined()
  // @IsNumber()
  // port: number;

  // @IsOptional()
  // @IsString()
  // host?: string;

  // @IsOptional()
  // @IsString()
  // username?: string;

  // @IsOptional()
  // @IsString()
  // password?: string;
}
