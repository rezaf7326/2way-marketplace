import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ProductStatus } from '../../common/enums';
import { User } from './user.entity';

@Table({
  tableName: 'Products',
  timestamps: true,
})
export class Product extends Model<Product> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  quantity: number;

  @Column({
    type: DataType.ENUM(
      ProductStatus.Pending,
      ProductStatus.Cancelled,
      ProductStatus.Disapproved,
      ProductStatus.Approved,
    ),
    defaultValue: ProductStatus.Pending,
  })
  status: ProductStatus;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  sellerId!: number;

  @BelongsTo(() => User)
  seller: User;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}
