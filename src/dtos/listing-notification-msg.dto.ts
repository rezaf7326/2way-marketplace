import { Product } from '../database/entities';

export class ListingNotificationMsgDto {
  type: 'new' | 'cancel';
  products: Array<Product['id']>;
}
