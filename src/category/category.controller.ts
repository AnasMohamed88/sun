import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Express } from "express";
import { Auth } from "../common/decorators/auth.decorator.js";
import { User } from "../common/decorators/user.decorator.js";
import { fileValidation, uploadFile } from "../common/utils/multer.options.js";
import { idParamSchema, type paginationDTO, paginationSchema } from "../common/utils/validation.js";
import { type HUser, RoleEnum } from "../user/types/user.type.js";
import { CategoryService } from "./category.service.js";
import { type createCategoryDTO, createCategorySchema, type updateCategoryDTO, updateCategorySchema } from "./category.validation.js";



@Controller("categories")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }


    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Auth(RoleEnum.admin)
    @UseInterceptors(FileInterceptor("image", uploadFile({ dest: "categories", allowedTypes: fileValidation.image, maxSizeMB: 2 })))
    async create(
        @Body({ schema: createCategorySchema }) body: createCategoryDTO,
        @User() user: HUser,
        @UploadedFile() file?: Express.Multer.File
    ) {
        const { data } = await this.categoryService.create(body, user, file)
        return { data }
    }


    @Get()
    async findAll(@Query({ schema: paginationSchema }) query: paginationDTO) {
        const { data } = await this.categoryService.findAll(query)
        return { data }
    }


    @Get(":id")
    async findOne(@Param("id", { schema: idParamSchema }) id: string) {
        const { data } = await this.categoryService.findOne(id)
        return { data }
    }


    @Patch(":id")
    @Auth(RoleEnum.admin)
    @UseInterceptors(FileInterceptor("image", uploadFile({ dest: "categories", allowedTypes: fileValidation.image, maxSizeMB: 2 })))
    async update(
        @Param("id", { schema: idParamSchema }) id: string,
        @Body({ schema: updateCategorySchema }) body: updateCategoryDTO,
        @User() user: HUser,
        @UploadedFile() file?: Express.Multer.File
    ) {
        const { data } = await this.categoryService.update(id, body, user, file)
        return { data }
    }


    @Delete(":id")
    @Auth(RoleEnum.admin)
    async remove(@Param("id", { schema: idParamSchema }) id: string) {
        const { data } = await this.categoryService.remove(id)
        return { data }
    }
}
