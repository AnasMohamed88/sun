import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { slugify } from "../utils/slugify.js";
import { User } from "./user.model.js";


@Schema({
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true },
    strict: true,
    strictQuery: true
})
export class Brand {

    @Prop({
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    })
    name: string;

    @Prop({
        type: String,
        unique: true,
        lowercase: true
    })
    slug: string;

    @Prop({
        type: String
    })
    image: string;

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

export type HBrand = HydratedDocument<Brand>

export const brandSchema = SchemaFactory.createForClass(Brand)

brandSchema.pre("save", function () {
    if (this.isModified("name")) {
        this.slug = slugify(this.name)
    }
})


export const BrandModel = MongooseModule.forFeature([{ name: Brand.name, schema: brandSchema }])
