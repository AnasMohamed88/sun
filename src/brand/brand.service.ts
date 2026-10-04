import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Express } from "express";
import { Model } from "mongoose";
import { Brand } from "../common/models/brand.model.js";
import { removeFile } from "../common/utils/file.js";
import { escapeRegex } from "../common/utils/regex.js";
import { slugify } from "../common/utils/slugify.js";
import { paginationDTO } from "../common/utils/validation.js";
import { HUser } from "../user/types/user.type.js";
import { createBrandDTO, updateBrandDTO } from "./brand.validation.js";



@Injectable()
export class BrandService {
    constructor(
        @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
    ) { }


    async create(body: createBrandDTO, user: HUser, file?: Express.Multer.File) {
        try {
            if (await this.brandModel.exists({ slug: slugify(body.name) })) {
                throw new ConflictException("brand already exist")
            }
            const brand = await this.brandModel.create({
                ...body,
                image: file?.path,
                createdBy: user._id
            })
            return {
                data: { brand }
            }
        } catch (error) {
            await removeFile(file?.path)
            throw error
        }
    }



    async findAll({ page, limit, search }: paginationDTO) {
        const filter = search ? { name: { $regex: escapeRegex(search), $options: "i" } } : {}
        const [brands, total] = await Promise.all([
            this.brandModel.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            this.brandModel.countDocuments(filter)
        ])
        return {
            data: {
                brands,
                meta: { page, limit, total, pages: Math.ceil(total / limit) }
            }
        }
    }



    async findOne(id: string) {
        const brand = await this.brandModel.findById(id)
        if (!brand) {
            throw new NotFoundException("brand not found")
        }
        return {
            data: { brand }
        }
    }



    async update(id: string, body: updateBrandDTO, user: HUser, file?: Express.Multer.File) {
        try {
            const brand = await this.brandModel.findById(id)
            if (!brand) {
                throw new NotFoundException("brand not found")
            }
            if (body.name && body.name != brand.name) {
                const isExist = await this.brandModel.exists({
                    slug: slugify(body.name),
                    _id: { $ne: brand._id }
                })
                if (isExist) {
                    throw new ConflictException("brand already exist")
                }
                brand.name = body.name
            }
            const oldImage = brand.image
            if (file) {
                brand.image = file.path
            }
            brand.updatedBy = user._id
            await brand.save()
            if (file) {
                await removeFile(oldImage)
            }
            return {
                data: { brand }
            }
        } catch (error) {
            await removeFile(file?.path)
            throw error
        }
    }



    async remove(id: string) {
        const brand = await this.brandModel.findByIdAndDelete(id)
        if (!brand) {
            throw new NotFoundException("brand not found")
        }
        await removeFile(brand.image)
        return {
            data: {}
        }
    }
}
