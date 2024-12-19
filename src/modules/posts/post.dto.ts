import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional } from "class-validator"
import { PostType, RoomType } from "./post.entity"

export class PostFilterDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(RoomType)
    roomType?: RoomType

    @ApiPropertyOptional()
    @IsOptional()
    utilities?: string

    @ApiPropertyOptional()
    @IsOptional()
    address?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    priceFrom?: number

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    priceTo?: number
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

    @ApiProperty()
    @IsInt()
    price: number
    
    @ApiProperty()
    @IsNotEmpty()
    area: string

    @ApiProperty()
    @IsInt()
    capacity: number

    @ApiPropertyOptional()
    @IsOptional()
    utilities?: string

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
    @IsInt()
    price?: number
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    area?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    capacity?: number

    @ApiPropertyOptional()
    @IsOptional()
    utilities?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(RoomType)
    roomType?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(PostType)
    postType?: string
}