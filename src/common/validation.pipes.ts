import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodError, ZodType } from "zod";








export class CustomValidationPipe implements PipeTransform {
    constructor(private schema: ZodType) { }
    async transform(value: any, metadata: ArgumentMetadata) {
        try {
            await this.schema.parseAsync(value)
            return value
        } catch (err) {
            if (err instanceof ZodError) {
                throw new BadRequestException({
                    massage: "validationError",
                    errors: err.issues
                })
            }
        }
    }
}

