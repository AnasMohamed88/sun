import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Express } from "express";
import { Auth } from "../common/decorators/auth.decorator.js";
import { User } from "../common/decorators/user.decorator.js";
import { fileValidation, uploadFile } from "../common/utils/multer.options.js";
import { idParamSchema } from "../common/utils/validation.js";
import { type HUser, RoleEnum } from "../user/types/user.type.js";
import { SubCategoryService } from "./subCategory.service.js";
import {
    type createSubCategoryDTO,
    createSubCategorySchema,
    type subCategoryQueryDTO,
    subCategoryQuerySchema,
    type updateSubCategoryDTO,
    updateSubCategorySchema
} from "./subCategory.validation.js";



@Controller("sub-categories")
export class SubCategoryController {
    constructor(private readonly subCategoryService: SubCategoryService) { }


    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Auth(RoleEnum.admin)
    @UseInterceptors(FileInterceptor("image", uploadFile({ dest: "sub-categories", allowedTypes: fileValidation.image, maxSizeMB: 2 })))
    async create(
        @Body({ schema: createSubCategorySchema }) body: createSubCategoryDTO,
        @User() user: HUser,
        @UploadedFile() file?: Express.Multer.File
    ) {
        const { data } = await this.subCategoryService.create(body, user, file)
        return { data }
    }


    @Get()
    async findAll(@Query({ schema: subCategoryQuerySchema }) query: subCategoryQueryDTO) {
        const { data } = await this.subCategoryService.findAll(query)
        return { data }
    }


    @Get(":id")
    async findOne(@Param("id", { schema: idParamSchema }) id: string) {
        const { data } = await this.subCategoryService.findOne(id)
        return { data }
    }


    @Patch(":id")
    @Auth(RoleEnum.admin)
    @UseInterceptors(FileInterceptor("image", uploadFile({ dest: "sub-categories", allowedTypes: fileValidation.image, maxSizeMB: 2 })))
    async update(
        @Param("id", { schema: idParamSchema }) id: string,
        @Body({ schema: updateSubCategorySchema }) body: updateSubCategoryDTO,
        @User() user: HUser,
        @UploadedFile() file?: Express.Multer.File
    ) {
        const { data } = await this.subCategoryService.update(id, body, user, file)
        return { data }
    }


    @Delete(":id")
    @Auth(RoleEnum.admin)
    async remove(@Param("id", { schema: idParamSchema }) id: string) {
        const { data } = await this.subCategoryService.remove(id)
        return { data }
    }
}
