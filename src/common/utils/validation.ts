import { isValidObjectId } from "mongoose";
import z from "zod";



export const objectIdSchema = z.string().refine((value) => isValidObjectId(value), {
    message: "in-valid id"
})


export const idParamSchema = objectIdSchema


export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().optional()
})


export type paginationDTO = z.infer<typeof paginationSchema>
