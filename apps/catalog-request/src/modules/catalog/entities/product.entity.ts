import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

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

  @Column()
  currency: string;

  @Column()
  img_url: string;

  @Column()
  totalQuantity: number;

  @Column()
  availableQuantity: number;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
