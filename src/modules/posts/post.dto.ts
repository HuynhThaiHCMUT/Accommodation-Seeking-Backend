import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator"
import { PostType, RoomType } from "./post.entity"
import { Gender } from "../users/user.entity"
import { UserDto } from "../users/user.dto";

export class FilesUploadDto {
    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    files: any[];
  }
  

export class PostDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string

    @ApiPropertyOptional()
    @IsOptional()
    description?: string

    @ApiProperty()
    @IsNotEmpty()
    address: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(Gender)
    gender?: string

    @ApiProperty()
    @IsInt()
    price: number

    @ApiProperty()
    @IsInt()
    deposit: number

    @ApiProperty()
    @IsInt()
    floor: number
    
    @ApiProperty()
    @IsInt()
    capacity: number
    
    @ApiProperty()
    @IsNotEmpty()
    area: number
    
    @ApiPropertyOptional()
    @IsOptional()
    utilities?: string

    @ApiPropertyOptional()
    @IsOptional()
    interior: string

    @ApiProperty()
    @IsEnum(RoomType)
    roomType: string

    @ApiProperty()
    @IsEnum(PostType)
    postType: string
}

export class UpdatePostDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    name?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    description?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    address?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(Gender)
    gender?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    price?: number

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    deposit?: number

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    floor?: number
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    capacity?: number
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    area?: number
    
    @ApiPropertyOptional()
    @IsOptional()
    utilities?: string

    @ApiPropertyOptional()
    @IsOptional()
    interior: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(RoomType)
    roomType?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(PostType)
    postType?: string
}

export class NoUserPostDto extends PostDto {
    @ApiProperty()
    postedAt: Date

    @ApiProperty()
    pictures: string[]
}

export class ResPostDto extends NoUserPostDto {
    @ApiProperty()
    postedBy: UserDto
}