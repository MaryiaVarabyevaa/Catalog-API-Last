import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

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
}
