import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomBytes, createCipheriv, createDecipheriv } from "crypto";
// import moduleName from 'crypto';








@Injectable()
export class EncryptionService {
    private readonly algorithm = "aes-256-gcm"
    private readonly key: Buffer
    constructor(private readonly configService: ConfigService) {
        this.key = Buffer.from(this.configService.getOrThrow<string>("ENCRYPTION_SECRET"), "hex")
        
    }

    encrypt(plainText: string): string {
        const iv = randomBytes(12)
        const cipher = createCipheriv(
            "aes-256-gcm",
            this.key,
            iv
        )
        const encrypted = Buffer.concat([
            cipher.update(plainText, "utf-8"),
            cipher.final()
        ])
        const authTag = cipher.getAuthTag()
        return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`
    }


    decrypt(payload: string) {
        const parts = payload.split(":") //3
        if (parts.length != 3) {
            throw new BadRequestException("invalid encrypted payload")
        }
        const [iv, authTag, encrypted] = parts.map(ele => Buffer.from(ele, "hex"))

        try {
            const decipher = createDecipheriv(this.algorithm, this.key, iv)
            decipher.setAuthTag(authTag)

            return Buffer.concat([
                decipher.update(encrypted),
                decipher.final()
            ]).toString("utf-8")
        } catch (err) {
            throw new BadRequestException("decrypt failed: wrong key inserted")
        }
    }


}