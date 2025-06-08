import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { User } from '../entities/user.entity';



export const GetUser = createParamDecorator(
    ( data: string[] | string | undefined, ctx: ExecutionContext ) => {

        const req = ctx.switchToHttp().getRequest()
        const user = req.user

        if ( !user )
            throw new InternalServerErrorException('User not found (request)')

        if (data === undefined){
            return user
        }

        if ( Array.isArray(data) ) {
            const requestedUserProperties: { [key: string]: any } = {};
            for (const prop of data) {
                if (user[prop] !== undefined) {
                    requestedUserProperties[prop] = user[prop];
                }
            }
            return requestedUserProperties;
        }


        if (typeof data === 'string') {
            if (user[data] === undefined) {
                throw new InternalServerErrorException('Invalid data type provided to GetUser decorator');
            }
            return user[data];
        }


        throw new InternalServerErrorException('Invalid data type provided to GetUser decorator');

    }
)