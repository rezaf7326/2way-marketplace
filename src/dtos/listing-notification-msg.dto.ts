import { User } from 'src/database/entities';

export class ListingNotificationMsgDto {
  type: 'new' | 'cancel';
  listingId: number;
  seller: Omit<User, 'passwordHash'>;
}
