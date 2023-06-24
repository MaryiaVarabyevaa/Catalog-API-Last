import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Details } from './details.entity';
import { Currency } from '../constants';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.BYN,
  })
  currency: Currency;

  @OneToMany(() => Details, (details) => details.cart)
  details: Details[];

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
