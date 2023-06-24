import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import {Currency} from "../constants";


@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['name'])
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.BYN,
  })
  currency: Currency;

  @Column()
  img_url: string;

  @Column()
  totalQuantity: number;

  @Column()
  availableQuantity: number;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
