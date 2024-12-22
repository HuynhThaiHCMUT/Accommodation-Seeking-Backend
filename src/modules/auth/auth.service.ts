import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignInDto, SignUpDto, TokenDto } from './auth.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(signInDto: SignInDto): Promise<TokenDto> {
        const user = await this.usersService.findOne({email: signInDto.email});
        if (!user) {
            throw new UnauthorizedException('Incorrect email or password');
        }
        const isMatch = await bcrypt.compare(signInDto.password, user?.password);
        if (!isMatch) {
            throw new UnauthorizedException('Incorrect email or password');
        }
        const { password, ...result } = user;
        return {
            token: this.jwtService.sign(result),
        };
    }

    async signUp(signUpDto: SignUpDto): Promise<TokenDto> {
        let existed: User;
        existed = await this.usersService.findOne({email: signUpDto.email});
        if (existed) {
            throw new UnprocessableEntityException('Email already exists');
        }
        existed = await this.usersService.findOne({phone: signUpDto.phone});
        if (existed) {
            throw new UnprocessableEntityException('Phone number already exists');
        }
        const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
        const user = await this.usersService.create({
            ...signUpDto,
            password: hashedPassword,
        });
        const { password, ...result } = user;
        return {
            token: this.jwtService.sign(result),
        }
    }
}
