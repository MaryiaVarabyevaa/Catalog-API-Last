import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Details } from './delails.entity';
import { OrderStatus } from '../constants';
import { Currency } from '../types';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.INCOMPLETE,
  })
  status: OrderStatus;

  @Column()
  currency: string;

  @Column()
  payment_id: string;

  @OneToMany(() => Details, (details) => details.order)
  details: Details[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
