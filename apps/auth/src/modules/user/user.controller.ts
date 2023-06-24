import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { UserService } from './user.service';
import { GetData, GetId } from '../../common/decorators';
import { ValidateUserData } from './types';
import { Pattern } from './constants';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: Pattern.VALIDATE_USER })
  async handleValidateUser(
    @GetData() validateUserData: ValidateUserData,
    @Ctx() context: RmqContext,
  ) {
    const res = await this.userService.validateUser(validateUserData);
    this.rmqService.ack(context);
    return res;
  }

  @MessagePattern({ cmd: Pattern.CHANGE_USER_ROLE })
  async handleChangeUserRole(@GetId() id: number, @Ctx() context: RmqContext) {
    const res = await this.userService.changeUserRole(id);
    this.rmqService.ack(context);
    return res;
  }
}
