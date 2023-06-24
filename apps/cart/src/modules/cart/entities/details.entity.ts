import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from './cart.entity';

@Entity()
export class Details {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cart_id' })
  cart_id: number;

  @Column()
  product_id: number;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @ManyToOne(() => Cart, (cart) => cart.details)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
