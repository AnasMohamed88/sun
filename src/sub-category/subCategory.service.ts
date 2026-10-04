import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Express } from "express";
import { Model, Types } from "mongoose";
import { Category } from "../common/models/category.model.js";
import { SubCategory } from "../common/models/subCategory.model.js";
import { removeFile } from "../common/utils/file.js";
import { escapeRegex } from "../common/utils/regex.js";
import { slugify } from "../common/utils/slugify.js";
import { HUser } from "../user/types/user.type.js";
import { createSubCategoryDTO, subCategoryQueryDTO, updateSubCategoryDTO } from "./subCategory.validation.js";



@Injectable()
export class SubCategoryService {
    constructor(
        @InjectModel(SubCategory.name) private readonly subCategoryModel: Model<SubCategory>,
        @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    ) { }


    private async ensureCategoryExists(categoryId: string) {
        if (!await this.categoryModel.exists({ _id: categoryId })) {
            throw new NotFoundException("category not found")
        }
    }



    async create(body: createSubCategoryDTO, user: HUser, file?: Express.Multer.File) {
        try {
            await this.ensureCategoryExists(body.category)
            const isExist = await this.subCategoryModel.exists({
                slug: slugify(body.name),
                category: body.category
            })
            if (isExist) {
                throw new ConflictException("sub-category already exist in this category")
            }
            const subCategory = await this.subCategoryModel.create({
                name: body.name,
                category: new Types.ObjectId(body.category),
                image: file?.path,
                createdBy: user._id
            })
            return {
                data: { subCategory }
            }
        } catch (error) {
            await removeFile(file?.path)
            throw error
        }
    }



    async findAll({ page, limit, search, category }: subCategoryQueryDTO) {
        const filter: Record<string, unknown> = {}
        if (search) {
            filter.name = { $regex: escapeRegex(search), $options: "i" }
        }
        if (category) {
            filter.category = category
        }
        const [subCategories, total] = await Promise.all([
            this.subCategoryModel.find(filter)
                .populate("category", "name slug image")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            this.subCategoryModel.countDocuments(filter)
        ])
        return {
            data: {
                subCategories,
                meta: { page, limit, total, pages: Math.ceil(total / limit) }
            }
        }
    }



    async findOne(id: string) {
        const subCategory = await this.subCategoryModel.findById(id).populate("category", "name slug image")
        if (!subCategory) {
            throw new NotFoundException("sub-category not found")
        }
        return {
            data: { subCategory }
        }
    }



    async update(id: string, body: updateSubCategoryDTO, user: HUser, file?: Express.Multer.File) {
        try {
            const subCategory = await this.subCategoryModel.findById(id)
            if (!subCategory) {
                throw new NotFoundException("sub-category not found")
            }
            if (body.category && body.category != subCategory.category.toString()) {
                await this.ensureCategoryExists(body.category)
                subCategory.category = new Types.ObjectId(body.category)
            }
            if (body.name) {
                subCategory.name = body.name
            }
            if (subCategory.isModified("name") || subCategory.isModified("category")) {
                const isExist = await this.subCategoryModel.exists({
                    slug: slugify(subCategory.name),
                    category: subCategory.category,
                    _id: { $ne: subCategory._id }
                })
                if (isExist) {
                    throw new ConflictException("sub-category already exist in this category")
                }
            }
            const oldImage = subCategory.image
            if (file) {
                subCategory.image = file.path
            }
            subCategory.updatedBy = user._id
            await subCategory.save()
            if (file) {
                await removeFile(oldImage)
            }
            return {
                data: { subCategory }
            }
        } catch (error) {
            await removeFile(file?.path)
            throw error
        }
    }



    async remove(id: string) {
        const subCategory = await this.subCategoryModel.findByIdAndDelete(id)
        if (!subCategory) {
            throw new NotFoundException("sub-category not found")
        }
        await removeFile(subCategory.image)
        return {
            data: {}
        }
    }
}
