import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { LogLevel } from '../../enums';

export class LoggerConfig {
  @IsBoolean()
  enable: boolean;

  @IsString()
  name: string;

  @IsEnum(LogLevel)
  level: LogLevel;
}
