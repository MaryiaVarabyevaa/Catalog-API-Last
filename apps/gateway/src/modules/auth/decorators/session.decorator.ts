import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {GqlExecutionContext} from "@nestjs/graphql";

export const Session = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const req = GqlExecutionContext.create(context).getContext().req;
        return req.session;
    },
);