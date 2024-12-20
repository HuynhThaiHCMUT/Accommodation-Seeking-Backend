import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsDateString, IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsOptional } from "class-validator"
import { Gender } from "./user.entity"


export class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}
  

export class UserDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    firstName?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
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
    @IsOptional()
    @IsDateString()
    birthdate?: string

    @ApiPropertyOptional()
    picture?: string
}