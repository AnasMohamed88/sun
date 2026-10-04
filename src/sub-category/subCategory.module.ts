import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { CategoryModel } from "../common/models/category.model.js";
import { SubCategoryModel } from "../common/models/subCategory.model.js";
import { UserModel } from "../common/models/user.model.js";
import { SubCategoryController } from "./subCategory.controller.js";
import { SubCategoryService } from "./subCategory.service.js";



@Module({
    imports: [SubCategoryModel, CategoryModel, UserModel, JwtModule],
    controllers: [SubCategoryController],
    providers: [SubCategoryService]
})
export class SubCategoryModule { }
