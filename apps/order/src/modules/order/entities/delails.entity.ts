import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Details {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column()
  quantity: number;

  @Column('float')
  price: number;

  @Column({ name: 'order_id' }) // Добавление поля с внешним ключом
  order_id: number;

  @ManyToOne(() => Order, (order) => order.details)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
