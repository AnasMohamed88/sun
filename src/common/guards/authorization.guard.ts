import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { HUser, RoleEnum } from "../../user/types/user.type.js";








@Injectable()
export class AuthorizationGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const user: HUser = context.switchToHttp().getRequest().user

        let roles = this.reflector.getAllAndOverride<string[]>(
            "roles",
            [context.getHandler(), context.getClass()]
        )
        roles = roles.length == 0 ? Object.values(RoleEnum) : roles
        console.log({roles});
        
        if (!roles.includes(user.role)) {
            throw new UnauthorizedException()
        }

        return true
    }
}