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
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Product } from './product.entity';

@Table({
  tableName: 'Listings',
  timestamps: true,
})
export class Listing extends Model<Listing> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @HasMany(() => Product)
  products: Product[];

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
