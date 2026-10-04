import z from "zod";



export const createBrandSchema = z.strictObject({
    name: z.string().trim().min(2).max(50)
})

export type createBrandDTO = z.infer<typeof createBrandSchema>


export const updateBrandSchema = z.strictObject({
    name: z.string().trim().min(2).max(50).optional()
})

export type updateBrandDTO = z.infer<typeof updateBrandSchema>
