import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, TokenDto } from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    @ApiOkResponse({ description: 'User signed in successfully', type: TokenDto })
    @ApiBadRequestResponse({ description: 'Bad request' })
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('sign-up')
    @ApiCreatedResponse({ description: 'User signed up successfully', type: TokenDto })
    @ApiBadRequestResponse({ description: 'Bad request' })
    signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }
}
