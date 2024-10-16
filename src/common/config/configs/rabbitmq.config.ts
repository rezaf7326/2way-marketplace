import { IsDefined, IsString } from 'class-validator';

export class RabbitMQConfig {
  @IsDefined()
  @IsString()
  url: string;
}
