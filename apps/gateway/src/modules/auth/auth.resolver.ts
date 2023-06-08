import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {AuthService} from "./auth.service";
import {User} from "./types";
import {CreateUserInput, LoginUserInput, UserIdInput} from "./dtos";


@Resolver('Auth')
export class AuthResolver {
    constructor(
       private readonly authService: AuthService
    ) {}

    @Query(() => [User])
    async getAllUser() {

    }

    @Mutation(() => User)
    async register(@Args('createUser') createUserInput: CreateUserInput) {
        return this.authService.register(createUserInput);
    }

    @Mutation(() => User)
    async login(@Args('loginUser') loginUserInput: LoginUserInput) {
        return this.authService.login(loginUserInput);
    }

    @Mutation(() => Boolean)
    async logout(@Args('id') userIdInput: UserIdInput) {
        return this.authService.logout(userIdInput);
    }

    @Mutation(() => Boolean)
    async refreshToken(
        @Args('id') userIdInput: UserIdInput
    ) {
        return this.authService.refreshTokens(userIdInput);
    }
}
