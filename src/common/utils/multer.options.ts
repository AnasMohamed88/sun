import { BadRequestException } from "@nestjs/common"
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface.js"
import { diskStorage } from "multer"



export const fileValidation = {
    image: ["image/jpeg", "image/png", "image/gif", "image/webp"]
}


export const uploadFile = ({
    dest = "general",
    allowedTypes,
    maxSizeMB,
}: {
    dest?: string
    allowedTypes?: string[]
    maxSizeMB?: number
}): MulterOptions => {
    return {
        storage: diskStorage({
            destination: `uploads/${dest}`,
            filename: (req, file, cb) => {
                const filename = `${Date.now()}_${file.originalname}`
                cb(null, filename)
            }
        }),
        fileFilter: (req, file, cb) => {
            if (allowedTypes && !allowedTypes.includes(file.mimetype)) {
                return cb(new BadRequestException("in-valid file type"), false)
            }
            cb(null, true)
        },
        limits: maxSizeMB ? { fileSize: maxSizeMB * 1024 * 1024 } : undefined,
    }
}
