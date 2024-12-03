import { Controller, Delete, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { PostDto } from '../posts/post.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
    @HttpCode(HttpStatus.OK)
    @Get()
    @ApiOkResponse({ description: 'Get user info', type: UserDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    getUser(@Request() req) {
        
    }

    @HttpCode(HttpStatus.OK)
    @Post()
    @ApiOkResponse({ description: 'Update user infomation'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    @ApiBadRequestResponse({ description: 'Bad request'})
    updateUser(@Request() req: UserDto) {
        
    }

    @HttpCode(HttpStatus.OK)
    @Delete()
    @ApiOkResponse({ description: 'Delete user'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    deleteUser(@Request() req) {
        
    }

    @HttpCode(HttpStatus.OK)
    @Get('posts')
    @ApiOkResponse({ description: 'Get user posts', type: [PostDto]})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    getUserPosts(@Request() req) {
        
    }
}
