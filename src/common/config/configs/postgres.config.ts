import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostgresConfig {
  @IsDefined()
  @IsString()
  host: string;

  @IsDefined()
  @IsNumber()
  port: number;

  @IsDefined()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsDefined()
  @IsString()
  database: string;
}
