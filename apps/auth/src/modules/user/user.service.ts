import * as bcrypt from "bcrypt";
import {Inject, Injectable, LoggerService} from "@nestjs/common";
import {RabbitRPC} from "@golevelup/nestjs-rabbitmq";
import {exchange, Queue, Roles, RoutingKey} from "./constants";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./entities";
import {RpcException} from "@nestjs/microservices";
import {LoginData} from "../../common/types";
import {WINSTON_MODULE_NEST_PROVIDER} from "nest-winston";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {}

    @RabbitRPC({
        exchange,
        routingKey: RoutingKey.VALIDATE_USER,
        queue: Queue.VALIDATE_USER,
    })
    async handleValidateUser({ email, password }: LoginData) {
        this.logger.log(`Validate user with ${email} email`);
        const user = await this.findUserByEmail(email);
        if (!user) {
            this.logger.error(`User with ${email} email doesnt exist`);
            return null;
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            this.logger.error(`User with ${email} entered incorrect password`);
            return null;
        }
        this.logger.log(`User with ${email} passed validation successfully`);
        return user;
    }

    @RabbitRPC({
        exchange,
        routingKey: RoutingKey.GET_ALL_USERS,
        queue: Queue.GET_ALL_USERS,
    })
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

    async addUser(createUserDto: User): Promise<User> {
        const user = await this.userRepository.create({ ...createUserDto });
        return this.userRepository.save(user);
    }

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