import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common"
import { AuthGuard } from "../guards/auth.guard.js"
import { AuthorizationGuard } from "../guards/authorization.guard.js"



export const Auth = (...roles: string[]) => {
    return applyDecorators(
        SetMetadata("roles", roles),
        UseGuards(AuthGuard),
        UseGuards(AuthorizationGuard)
    )
}