import bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignInDto, SignUpDto } from './auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(signInDto: SignInDto): Promise<string> {
        const user = await this.usersService.findOne(signInDto.phone);
        const isMatch = await bcrypt.compare(signInDto.password, user?.password);
        if (!isMatch) {
            throw new UnauthorizedException();
        }
        const { password, id, ...result } = user;
        return this.jwtService.signAsync(result);;
    }

    async signUp(signUpDto: SignUpDto): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(signUpDto.password, salt);
        const user = await this.usersService.create({
            ...signUpDto,
            password: hashedPassword,
        });
        const { password, id, ...result } = user;
        return this.jwtService.signAsync(result);
    }
}
