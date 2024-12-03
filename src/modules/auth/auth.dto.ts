import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
    @ApiProperty()
    phone: string;
    @ApiProperty()
    password: string;
}

export class SignUpDto {
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty()
    phone: string;
    @ApiProperty()
    birthDate: Date;
    @ApiProperty()
    gender: string;
}

export class TokenDto {
    @ApiProperty()
    token: string;
}