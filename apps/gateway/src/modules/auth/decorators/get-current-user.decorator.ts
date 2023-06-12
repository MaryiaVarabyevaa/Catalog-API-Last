import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {GqlExecutionContext} from "@nestjs/graphql";
import {JwtPayloadWithRt} from "../types";


export const GetCurrentUser = createParamDecorator(
    (data: keyof JwtPayloadWithRt, context: ExecutionContext) => {
        const req = GqlExecutionContext.create(context).getContext().req;
        if (!data) return req.user;
        return req.user[data];
    },
);