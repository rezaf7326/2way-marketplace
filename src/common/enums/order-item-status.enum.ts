export enum OrderItemStatus {
  Pending = 'pending',
  Cancelled = 'cancelled', // by buyer
  Rejected = 'rejected', // by seller
  Processing = 'processing',
  Done = 'done',
}
