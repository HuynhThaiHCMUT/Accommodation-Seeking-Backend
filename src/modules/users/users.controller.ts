import { diskStorage } from 'multer';
import { Body, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, Req, Request, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FileUploadDto, ResUserDto, UserDto } from './user.dto';
import { UsersService } from './users.service';
import { NoUserPostDto } from '../posts/post.dto';
import { PostType } from '../posts/post.entity';
import { PostsService } from '../posts/posts.service';
import { Public } from '../auth/auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor( 
        private readonly usersService: UsersService,
        private readonly postsService: PostsService,
    ) {}

    @Public()
    @Get(':id?') // Make the id parameter optional
    @ApiParam({ name: 'id', required: false, type: Number })
    @ApiOkResponse({ description: 'Get user info successfully', type: ResUserDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async getUser(
        @Req() req,
        @Param('id', new ParseIntPipe({optional: true})) id?: number, // Optional id parameter
    ) {
        const userId = id ?? req?.user?.id; // Use id if provided; otherwise, use the id from the JWT
        const user = await this.usersService.findOne({ id: userId });

        if (!user) throw new NotFoundException();

        // Remove sensitive fields before returning the user
        return { ...user, password: undefined };
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

    @Public()
    @Get(':id/posts')
    @ApiQuery({ name: 'postType', required: true, type: String, enum: PostType })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiOkResponse({ description: 'Get user posts successfully', type: [NoUserPostDto]})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    getUserPosts(
        @Param('id', ParseIntPipe) id: number,
        @Query('postType') postType: string,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number, 
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number, 
    ) {
        return this.postsService.getPostsByUser(id, postType, offset, limit);
    }

    @Post(':id/picture')
    @ApiBody({ description: 'Upload picture', type: FileUploadDto})
    @ApiOkResponse({ description: 'Upload picture successfully', type: String})
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
