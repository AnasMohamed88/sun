import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./DTO/user.dto.js";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../common/models/user.model.js";
import { Model } from "mongoose";
import { confirmEmailDTO, loginDTO, signupDTO } from "./user.validation.js";
import { EncryptionService } from "../common/security/enctryption.service.js";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { createOtp } from "../common/email/createOtp.js";
import { signupKey } from "../common/redis/redis.service.js";
import { sendEmail } from "../common/email/sendEmail.js";
import { HashService } from "../common/security/hash.service.js";
import { privateDecrypt } from "crypto";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";



@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly hashService: HashService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {
    }
    /**
     * get data
     * find email
     * hash password 
     * encrypt phone
     * create otp
     * send email 
     * save user
     */


    async signup(body: signupDTO) {
        const isEmailExist = await this.userModel.findOne({
            email: body.email
        })
        if (isEmailExist) {
            throw new BadRequestException("email already exist")
        }
        const user = await this.userModel.create(body)
        const otp = createOtp()
        await this.cacheManager.set(signupKey(user.id), otp, 5 * 60 * 1000)
        sendEmail({
            to: user.email, subject: "confirm your email", html: `
                <h1>${otp}</h1>
            `})
        return {
            data: {
                user
            }
        }
    }



    async confirmEmail(body: confirmEmailDTO) {
        const user = await this.userModel.findOne({ email: body.email })
        if (!user) {
            throw new NotFoundException("user not found")
        }
        if (user.confirmedAt) {
            throw new BadRequestException("already confirmed")
        }
        const otp = await this.cacheManager.get<string>(signupKey(user.id))
        if (!otp || otp != body.otp) {
            throw new BadRequestException("in-valid or expired otp")
        }
        user.confirmedAt = new Date(Date.now())
        await user.save()
        await this.cacheManager.del(signupKey(user.id))
        return {
            data: {

            }
        }
    }



    async login(body: loginDTO) {
        const user = await this.userModel.findOne({ email: body.email })
        if (!user) {
            throw new BadRequestException("in-valid credentials")
        }
        if (!user.confirmedAt) {
            throw new BadRequestException("confirm your account first")
        }
        if (!await this.hashService.compare(body.password, user.password)) {
            throw new BadRequestException("in-valid credentials")
        }
        const accessToken = await this.jwtService.signAsync({
            _id: user._id,
            email: user.email
        }, {
            secret: this.configService.get<string>("TOKEN_SECRET"),
            expiresIn: "30m"
        })
        return {
            data:{
                accessToken
            }
        }

    }

}