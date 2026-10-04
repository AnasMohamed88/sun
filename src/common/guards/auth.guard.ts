import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Request } from "express";
import { Model } from "mongoose";
import { HUser, ITokenPayload } from "../../user/types/user.type.js";
import { User } from "../models/user.model.js";

declare module "express-serve-static-core" {
    interface Request {
        user: HUser
    }
}




@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const req: Request = context.switchToHttp().getRequest()
            const { authorization } = req.headers
            if (!authorization || !authorization.startsWith("Bearer")) {
                throw new UnauthorizedException()
            }
            const token = authorization.split(" ")[1]
            if (!token) {
                throw new UnauthorizedException()
            }
            const payload = await this.jwtService.verifyAsync<ITokenPayload>(token, {
                secret: this.configService.get<string>("TOKEN_SECRET")
            })
            const user = await this.userModel.findById(payload._id)
            if (!user) {
                throw new UnauthorizedException()
            }
            if (!user.confirmedAt) {
                throw new UnauthorizedException()
            }


            req.user = user
            return true

        } catch (error) {
            throw new UnauthorizedException(error)
        }
    }
}