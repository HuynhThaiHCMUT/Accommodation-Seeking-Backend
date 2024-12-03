import { ApiProperty } from "@nestjs/swagger"

export class UserDto {
    @ApiProperty()
    firstName: string
    @ApiProperty()
    lastName: string
    @ApiProperty()
    email: string
    @ApiProperty()
    phone: string
    @ApiProperty()
    gender: string
    @ApiProperty()
    birthdate: Date
    @ApiProperty()
    picture: string
}