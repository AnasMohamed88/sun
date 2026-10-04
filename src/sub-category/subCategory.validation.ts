import z from "zod";
import { objectIdSchema, paginationSchema } from "../common/utils/validation.js";



export const createSubCategorySchema = z.strictObject({
    name: z.string().trim().min(2).max(50),
    category: objectIdSchema
})

export type createSubCategoryDTO = z.infer<typeof createSubCategorySchema>


export const updateSubCategorySchema = z.strictObject({
    name: z.string().trim().min(2).max(50).optional(),
    category: objectIdSchema.optional()
})

export type updateSubCategoryDTO = z.infer<typeof updateSubCategorySchema>


export const subCategoryQuerySchema = paginationSchema.extend({
    category: objectIdSchema.optional()
})

export type subCategoryQueryDTO = z.infer<typeof subCategoryQuerySchema>
