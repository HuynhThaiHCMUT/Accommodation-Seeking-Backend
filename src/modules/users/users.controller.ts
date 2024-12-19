import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Put, Request, UnauthorizedException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { UsersService } from './users.service';
import { PostDto } from '../posts/post.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor( private readonly usersService: UsersService) {}
    
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    @ApiOkResponse({ description: 'Get user info successfully', type: UserDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    async getUser(@Param('id', ParseIntPipe) id) {
        const user = await this.usersService.findOne({id});
        if (!user) throw new NotFoundException();
        return {...user, password: undefined, id: undefined};
    }

    @HttpCode(HttpStatus.OK)
    @Put(':id')
    @ApiOkResponse({ description: 'Update user infomation successfully'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    @ApiBadRequestResponse({ description: 'Bad request'})
    updateUser(@Param('id', ParseIntPipe) id, @Request() req, @Body() body: UserDto) {
        if (req.user?.id !== id) throw new UnauthorizedException();
        return this.usersService.update(req.user.id, body);
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    @ApiOkResponse({ description: 'Delete user successfully'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    deleteUser(@Param('id', ParseIntPipe) id, @Request() req) {
        if (req.user?.id !== id) throw new UnauthorizedException();
        return this.usersService.delete(req.user.id);
    }

    @HttpCode(HttpStatus.OK)
    @Get(':id/posts')
    @ApiOkResponse({ description: 'Get user posts successfully', type: [PostDto]})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    getUserPosts(@Param('id', ParseIntPipe) id) {
        return this.usersService.getPostsByUser(id);
    }
}
