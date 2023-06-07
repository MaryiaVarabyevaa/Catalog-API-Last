import {Body, Controller, Get} from '@nestjs/common';
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    @Get('/register')
    async register(@Body() newUser: any): Promise<string> {
        await this.authService.register();
        return 'Register';
    }

    @Get('/login')
    async login(@Body() newUser: any): Promise<string> {
        // await this.authService.login(newUser);
        return 'Login';
    }

    @Get('/logout')
    async logout(): Promise<string> {
        // await this.authService.logout();
        return 'Logout'
    }


    @Get('/refresh')
    async refreshRT(): Promise<string> {
        // await this.authService.refreshTokens();
        return 'Refresh'
    }
}
