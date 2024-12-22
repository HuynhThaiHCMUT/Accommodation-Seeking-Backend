import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, MinLength } from "class-validator";
import { Gender } from "../users/user.entity";

export class SignInDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ minLength: 8 })
    @MinLength(8)
    password: string;
}

export class SignUpDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @MinLength(8)
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsMobilePhone()
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    birthdate: Date;

    @ApiProperty()
    @IsEnum(Gender)
    gender: string;
}

export class TokenDto {
    @ApiProperty()
    token: string;
}