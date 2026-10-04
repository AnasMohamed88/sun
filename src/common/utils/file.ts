import { unlink } from "fs/promises"



export const removeFile = async (path?: string) => {
    if (!path) {
        return
    }
    try {
        await unlink(path)
    } catch {
        // file already removed or never existed
    }
}
