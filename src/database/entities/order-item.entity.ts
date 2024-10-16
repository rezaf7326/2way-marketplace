import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { Product, Order } from '.';

@Table({
  tableName: 'OrderItems',
  timestamps: false,
})
export class OrderItem extends Model<OrderItem> {
  @ForeignKey(() => Order)
  @Column(DataType.INTEGER)
  orderId!: number;

  @ForeignKey(() => Product)
  @Column(DataType.INTEGER)
  productId!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity!: number;
}
