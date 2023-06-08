import {createParamDecorator, ExecutionContext} from "@nestjs/common";
//
// export const GetCookie = createParamDecorator(
//     (cookieName: string, ctx: ExecutionContext) => {
//         const request = ctx.switchToHttp().getRequest<Request>();
//         return {
//             refreshToken: request.cookies['refreshToken'],
//             accessToken: request.cookies['accessToken'],
//         };
//     },
// );