import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Details } from './details.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  currency: string;

  @OneToMany(() => Details, (details) => details.cart)
  details: Details[];
}
