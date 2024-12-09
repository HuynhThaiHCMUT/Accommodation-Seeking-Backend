import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, TokenDto } from './auth.dto';
import { Public } from './auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    @ApiOkResponse({ description: 'User signed in successfully', type: TokenDto })
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiUnauthorizedResponse({ description: 'Incorrect phone number or password' })
    signIn(@Body() signInDto: SignInDto): Promise<TokenDto> {
        return this.authService.signIn(signInDto);
    }

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('sign-up')
    @ApiCreatedResponse({ description: 'User signed up successfully', type: TokenDto })
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiUnprocessableEntityResponse({ description: 'Phone number or email already exists' })
    signUp(@Body() signUpDto: SignUpDto): Promise<TokenDto> {
        return this.authService.signUp(signUpDto);
    }
}
