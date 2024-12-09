import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

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