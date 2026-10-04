import z from "zod";



export const createCategorySchema = z.strictObject({
    name: z.string().trim().min(2).max(50)
})

export type createCategoryDTO = z.infer<typeof createCategorySchema>


export const updateCategorySchema = z.strictObject({
    name: z.string().trim().min(2).max(50).optional()
})

export type updateCategoryDTO = z.infer<typeof updateCategorySchema>
