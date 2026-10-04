import { IsEmail, IsInt, IsString, IsStrongPassword, Max, MaxLength, Min, MinLength } from "class-validator"

interface x{
    name:string
}


export class CreateUserDTO {

    @IsString()
    @MaxLength(50)
    @MinLength(3)
    name:string

    @IsEmail()
    email:string

    @IsInt()
    @Max(60)
    @Min(15)
    age:number

    @IsStrongPassword()
    password:string
}


export class QueryDTO{
    @IsString()
    age:string
}