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
    name?: string

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

export class ResUserDto extends UserDto {
    @ApiProperty()
    id: number
}