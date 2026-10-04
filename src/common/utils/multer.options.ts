import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface.js"
import { diskStorage } from "multer"




export const uploadFile = ({
    dest = "general",

}):MulterOptions  => {
    return {
        storage: diskStorage({
            destination: `uploads/${dest}`,
            filename: (req, file, cb) => {
                const filename = `${Date.now()}_${file.originalname}`
                cb(null, filename)
            }
        }),
        

    }
}