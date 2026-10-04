import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Express } from "express";
import { Auth } from "../common/decorators/auth.decorator.js";
import { User } from "../common/decorators/user.decorator.js";
import { fileValidation, uploadFile } from "../common/utils/multer.options.js";
import { idParamSchema, type paginationDTO, paginationSchema } from "../common/utils/validation.js";
import { type HUser, RoleEnum } from "../user/types/user.type.js";
import { BrandService } from "./brand.service.js";
import { type createBrandDTO, createBrandSchema, type updateBrandDTO, updateBrandSchema } from "./brand.validation.js";



@Controller("brands")
export class BrandController {
    constructor(private readonly brandService: BrandService) { }


    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Auth(RoleEnum.admin)
    @UseInterceptors(FileInterceptor("image", uploadFile({ dest: "brands", allowedTypes: fileValidation.image, maxSizeMB: 2 })))
    async create(
        @Body({ schema: createBrandSchema }) body: createBrandDTO,
        @User() user: HUser,
        @UploadedFile() file?: Express.Multer.File
    ) {
        const { data } = await this.brandService.create(body, user, file)
        return { data }
    }


    @Get()
    async findAll(@Query({ schema: paginationSchema }) query: paginationDTO) {
        const { data } = await this.brandService.findAll(query)
        return { data }
    }


    @Get(":id")
    async findOne(@Param("id", { schema: idParamSchema }) id: string) {
        const { data } = await this.brandService.findOne(id)
        return { data }
    }


    @Patch(":id")
    @Auth(RoleEnum.admin)
    @UseInterceptors(FileInterceptor("image", uploadFile({ dest: "brands", allowedTypes: fileValidation.image, maxSizeMB: 2 })))
    async update(
        @Param("id", { schema: idParamSchema }) id: string,
        @Body({ schema: updateBrandSchema }) body: updateBrandDTO,
        @User() user: HUser,
        @UploadedFile() file?: Express.Multer.File
    ) {
        const { data } = await this.brandService.update(id, body, user, file)
        return { data }
    }


    @Delete(":id")
    @Auth(RoleEnum.admin)
    async remove(@Param("id", { schema: idParamSchema }) id: string) {
        const { data } = await this.brandService.remove(id)
        return { data }
    }
}
