import { ApiProperty } from "@nestjs/swagger"

export class PostDto {
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    @ApiProperty()
    address: string
    @ApiProperty()
    price: number
    @ApiProperty()
    area: string
    @ApiProperty()
    capacity: number
    @ApiProperty()
    roomType: string
    @ApiProperty()
    postType: string
}