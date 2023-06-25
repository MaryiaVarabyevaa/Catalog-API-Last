import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from '../../user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  async serializeUser(
    user: any,
    done: (err: Error, user: any) => void,
  ): Promise<void> {
    const a = { id: 7 };
    // console.log('user', user);
    done(null, { id: a.id });
  }

  async deserializeUser(
    payload: any,
    done: (err: Error, user: any) => void,
  ): Promise<void> {
    try {
      // const user = await this.userService.findById(id);
      const user = {};
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
}
