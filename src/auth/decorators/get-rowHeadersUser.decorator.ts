import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";



export const GetRowHeaders = createParamDecorator(
    ( data, ctx: ExecutionContext ) => {

        const req = ctx.switchToHttp().getRequest()
        const rawHeadersUser = req.rawHeaders


        if ( !rawHeadersUser )
            throw new InternalServerErrorException('User not found (rawHeadersUser)')


        return rawHeadersUser

    }
)