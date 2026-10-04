import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Express } from "express";
import { Model } from "mongoose";
import { Category } from "../common/models/category.model.js";
import { SubCategory } from "../common/models/subCategory.model.js";
import { removeFile } from "../common/utils/file.js";
import { escapeRegex } from "../common/utils/regex.js";
import { slugify } from "../common/utils/slugify.js";
import { paginationDTO } from "../common/utils/validation.js";
import { HUser } from "../user/types/user.type.js";
import { createCategoryDTO, updateCategoryDTO } from "./category.validation.js";



@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
        @InjectModel(SubCategory.name) private readonly subCategoryModel: Model<SubCategory>,
    ) { }


    async create(body: createCategoryDTO, user: HUser, file?: Express.Multer.File) {
        try {
            if (await this.categoryModel.exists({ slug: slugify(body.name) })) {
                throw new ConflictException("category already exist")
            }
            const category = await this.categoryModel.create({
                ...body,
                image: file?.path,
                createdBy: user._id
            })
            return {
                data: { category }
            }
        } catch (error) {
            await removeFile(file?.path)
            throw error
        }
    }



    async findAll({ page, limit, search }: paginationDTO) {
        const filter = search ? { name: { $regex: escapeRegex(search), $options: "i" } } : {}
        const [categories, total] = await Promise.all([
            this.categoryModel.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            this.categoryModel.countDocuments(filter)
        ])
        return {
            data: {
                categories,
                meta: { page, limit, total, pages: Math.ceil(total / limit) }
            }
        }
    }



    async findOne(id: string) {
        const category = await this.categoryModel.findById(id).populate("subCategories")
        if (!category) {
            throw new NotFoundException("category not found")
        }
        return {
            data: { category }
        }
    }



    async update(id: string, body: updateCategoryDTO, user: HUser, file?: Express.Multer.File) {
        try {
            const category = await this.categoryModel.findById(id)
            if (!category) {
                throw new NotFoundException("category not found")
            }
            if (body.name && body.name != category.name) {
                const isExist = await this.categoryModel.exists({
                    slug: slugify(body.name),
                    _id: { $ne: category._id }
                })
                if (isExist) {
                    throw new ConflictException("category already exist")
                }
                category.name = body.name
            }
            const oldImage = category.image
            if (file) {
                category.image = file.path
            }
            category.updatedBy = user._id
            await category.save()
            if (file) {
                await removeFile(oldImage)
            }
            return {
                data: { category }
            }
        } catch (error) {
            await removeFile(file?.path)
            throw error
        }
    }



    async remove(id: string) {
        const category = await this.categoryModel.findByIdAndDelete(id)
        if (!category) {
            throw new NotFoundException("category not found")
        }
        // cascade: a sub-category cannot exist without its parent category
        const subCategories = await this.subCategoryModel.find({ category: category._id }, { image: 1 })
        await this.subCategoryModel.deleteMany({ category: category._id })
        await Promise.all([
            removeFile(category.image),
            ...subCategories.map((sub) => removeFile(sub.image))
        ])
        return {
            data: {}
        }
    }
}
