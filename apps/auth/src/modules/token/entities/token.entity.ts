import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rt: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.token)
  user: User;
}
