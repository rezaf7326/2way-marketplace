import { User } from 'src/database/entities';

export class OrderNotificationMsgDto {
  type: 'new' | 'cancel';
  orderId: number;
  buyer: Omit<User, 'passwordHash'>;
}
