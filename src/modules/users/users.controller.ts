import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Put, Request, UnauthorizedException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './user.dto';
import { PostDto } from '../posts/post.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
    @HttpCode(HttpStatus.OK)
    @Get()
    @ApiOkResponse({ description: 'Get user info successfully', type: UserDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    async getUser(@Request() req) {
        const user = await this.usersService.findOne({id: req.user.id});
        if (!user) throw new UnauthorizedException();
        return {...user, password: undefined, id: undefined};
    }

    @HttpCode(HttpStatus.OK)
    @Put()
    @ApiOkResponse({ description: 'Update user infomation successfully'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    @ApiBadRequestResponse({ description: 'Bad request'})
    updateUser(@Request() req, @Body() body: UserDto) {
        return this.usersService.update(req.user.id, body);
    }

    @HttpCode(HttpStatus.OK)
    @Delete()
    @ApiOkResponse({ description: 'Delete user successfully'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    deleteUser(@Request() req) {
        return this.usersService.delete(req.user.id);
    }

    @HttpCode(HttpStatus.OK)
    @Get('posts')
    @ApiOkResponse({ description: 'Get user posts successfully', type: [PostDto]})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    getUserPosts(@Request() req) {
        
    }
}
