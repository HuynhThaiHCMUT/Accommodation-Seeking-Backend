import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsEmail, IsEnum, IsMobilePhone, IsOptional } from "class-validator"
import { Gender } from "./user.entity"

export class UserDto {
    @ApiPropertyOptional()
    firstName?: string

    @ApiPropertyOptional()
    lastName?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsMobilePhone()
    phone?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(Gender)
    gender?: string

    @ApiPropertyOptional()
    birthdate?: Date

    @ApiPropertyOptional()
    picture?: string
}