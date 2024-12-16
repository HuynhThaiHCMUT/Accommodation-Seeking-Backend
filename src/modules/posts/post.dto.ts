import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional } from "class-validator"

export class PostDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsNotEmpty()
    description: string

    @ApiProperty()
    @IsNotEmpty()
    address: string

    @ApiProperty()
    @IsNotEmpty()
    price: number
    
    @ApiProperty()
    @IsNotEmpty()
    area: string

    @ApiProperty()
    @IsNotEmpty()
    capacity: number

    @ApiProperty()
    @IsNotEmpty()
    roomType: string

    @ApiProperty()
    @IsNotEmpty()
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
    @IsNotEmpty()
    price?: number
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    area?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    capacity?: number

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    roomType?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    postType?: string
}