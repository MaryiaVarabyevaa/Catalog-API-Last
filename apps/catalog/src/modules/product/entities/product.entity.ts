import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  @Unique(['name'])
  name: string;

  @Index()
  @Column()
  description: string;

  @Index()
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
