import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { CategoryModel } from "../common/models/category.model.js";
import { SubCategoryModel } from "../common/models/subCategory.model.js";
import { UserModel } from "../common/models/user.model.js";
import { CategoryController } from "./category.controller.js";
import { CategoryService } from "./category.service.js";



@Module({
    imports: [CategoryModel, SubCategoryModel, UserModel, JwtModule],
    controllers: [CategoryController],
    providers: [CategoryService]
})
export class CategoryModule { }
