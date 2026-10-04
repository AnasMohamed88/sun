import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, SetMetadata, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Auth } from "../common/decorators/auth.decorator.js";
import { User } from "../common/decorators/user.decorator.js";
import { type HUser, RoleEnum } from "./types/user.type.js";
import { UserService } from "./user.service.js";
import { type confirmEmailDTO, confirmEmailSchema, type loginDTO, loginSchema, type signupDTO, signupSchema } from "./user.validation.js";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import type { Express } from 'express';
import { diskStorage } from "multer";
import { uploadFile } from "../common/utils/multer.options.js";

@Controller("users")
@SetMetadata("roles", [RoleEnum.user])
export class UserController {

    constructor(
        private readonly userService: UserService,
        private readonly config: ConfigService

    ) { }




    @Post("signup")
    @HttpCode(HttpStatus.CREATED)
    async signup(
        @Body({
            schema: signupSchema
        }) body: signupDTO
    ) {
        // throw new NotFoundException()
        const { data } = await this.userService.signup(body)
        return {
            data
        }
    }


    @Patch("confirm-email")
    @HttpCode(200)
    async confirmEmail(@Body({
        schema: confirmEmailSchema
    }) body: confirmEmailDTO) {
        const { data } = await this.userService.confirmEmail(body)
        return {
            data
        }
    }



    @Post("login")
    @HttpCode(200)
    async login(@Body({ schema: loginSchema }) body: loginDTO) {
        const { data } = await this.userService.login(body)
        return {
            data
        }
    }


    // @Get("me")
    // // @SetMetadata("roles", [RoleEnum.admin])

    // // @UseGuards(AuthGuard, AuthorizationGuard) // RBAC => Role Based Access Control
    // @Auth()

    // async profile(@User() user: HUser) { // handler
    //     console.log("handler");

    //     return {
    //         data: {
    //             user
    //         }
    //     }
    // }




    @Post("upload-file")
    @UseInterceptors(FileInterceptor("image", uploadFile({dest:"images"})))
    uploadFile(@UploadedFiles() file: Express.Multer.File[]) {
        console.log({ file });
        return {
            data: { file }
        }
    }
}

