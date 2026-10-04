import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { slugify } from "../utils/slugify.js";
import { Category } from "./category.model.js";
import { User } from "./user.model.js";


@Schema({
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true },
    strict: true,
    strictQuery: true
})
export class SubCategory {

    @Prop({
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    })
    name: string;

    @Prop({
        type: String,
        lowercase: true
    })
    slug: string;

    @Prop({
        type: String
    })
    image: string;

    @Prop({
        type: Types.ObjectId,
        ref: Category.name,
        required: true
    })
    category: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: User.name,
        required: true
    })
    createdBy: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: User.name
    })
    updatedBy: Types.ObjectId;
}

export type HSubCategory = HydratedDocument<SubCategory>

export const subCategorySchema = SchemaFactory.createForClass(SubCategory)

// the same name can exist under different categories, but not twice in one
subCategorySchema.index({ name: 1, category: 1 }, { unique: true })
subCategorySchema.index({ slug: 1, category: 1 }, { unique: true })

subCategorySchema.pre("save", function () {
    if (this.isModified("name")) {
        this.slug = slugify(this.name)
    }
})


export const SubCategoryModel = MongooseModule.forFeature([{ name: SubCategory.name, schema: subCategorySchema }])
