import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from './constants';
import { User } from './entities';
import { CreateUserData, LoginUserData } from '../auth/types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateUser({ email, password }: LoginUserData): Promise<User> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }
    return user;
  }

  async handleGetAllUsers(msg: any) {
    const users = await this.userRepository.find();
    return users;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async findUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  async addUser(createUserData: CreateUserData): Promise<User> {
    const user = await this.userRepository.create({ ...createUserData });
    return this.userRepository.save(user);
  }

  // доделать, чтобы возвращались токены
  async changeUserRole(id: number): Promise<void | null> {
    const isExistedUser = await this.findUserById(id);
    if (!isExistedUser) {
      return null;
    }
    const { role } = isExistedUser;
    const newRole = Roles.USER === role ? Roles.ADMIN : Roles.USER;
    await this.userRepository.update(id, { role: newRole });
  }
}
