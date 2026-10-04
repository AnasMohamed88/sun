import { HydratedDocument, Types } from "mongoose"




export enum GenderEnum {
    male = "0",
    female = "1"
}

export enum ProviderEnum {
    system = "0",
    google = "1"
}

export enum RoleEnum {
    user = "0",
    admin = "1"
}


export interface IUser {
    name: string
    email: string
    password: string
    age: number
    isOnline: boolean
    isActive: boolean
    gender: GenderEnum
    phone: string
    confirmedAt: Date
    changedCredentialsAt: Date
    provider: ProviderEnum
    role: RoleEnum
    profilePic: string
    coverPics: [string]
    bio: string
}
export type HUser = HydratedDocument<IUser>






export interface ITokenPayload{
    iat:number
    exp?:number
    _id:Types.ObjectId
    email:string
}