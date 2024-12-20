import { diskStorage } from 'multer';
import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Request, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FileUploadDto, UserDto } from './user.dto';
import { UsersService } from './users.service';
import { PostDto } from '../posts/post.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor( private readonly usersService: UsersService) {}
    
    @Get(':id')
    @ApiOkResponse({ description: 'Get user info successfully', type: UserDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    async getUser(@Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.findOne({id});
        if (!user) throw new NotFoundException();
        return {...user, password: undefined, id: undefined};
    }


    @Put(':id')
    @ApiOkResponse({ description: 'Update user infomation successfully'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    @ApiBadRequestResponse({ description: 'Bad request'})
    updateUser(@Param('id', ParseIntPipe) id: number, @Request() req, @Body() body: UserDto) {
        if (req.user?.id !== id) throw new UnauthorizedException();
        return this.usersService.update(req.user.id, body);
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'Delete user successfully'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    deleteUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
        if (req.user?.id !== id) throw new UnauthorizedException();
        return this.usersService.delete(req.user.id);
    }

    @Get(':id/posts')
    @ApiOkResponse({ description: 'Get user posts successfully', type: [PostDto]})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    getUserPosts(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.getPostsByUser(id);
    }

    @Post(':id/avatar')
    @ApiBody({ description: 'Upload avatar', type: FileUploadDto})
    @ApiOkResponse({ description: 'Upload avatar successfully', type: String})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './pictures',
                filename: (req, file, callback) => {
                    const id = req.params.id;
                    const filename = `${id}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`;
                    callback(null, filename);
                },
            }),
        }),
    )
    uploadAvatar(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new NotFoundException('File not found');
        }
        return this.usersService.uploadAvatar(id, file.filename);
    }
}
