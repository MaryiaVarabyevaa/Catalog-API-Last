import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Roles} from "../constants";
import {Token} from "../../token/entities";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column( {
        type: 'enum',
        enum: Roles,
        default: Roles.USER,
    })
    role: Roles

    @OneToMany(() => Token, (token) => token.user)
    token: Token[];
}