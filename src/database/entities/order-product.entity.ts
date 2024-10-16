import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { Product, Order } from '.';

@Table({
  tableName: 'OrderProducts',
  timestamps: false,
})
export class OrderProduct extends Model<OrderProduct> {
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
