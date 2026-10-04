import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { BrandModel } from "../common/models/brand.model.js";
import { UserModel } from "../common/models/user.model.js";
import { BrandController } from "./brand.controller.js";
import { BrandService } from "./brand.service.js";



@Module({
    imports: [BrandModel, UserModel, JwtModule],
    controllers: [BrandController],
    providers: [BrandService]
})
export class BrandModule { }
