import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Body, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FilesUploadDto, PostDto, UpdatePostDto } from './post.dto';
import { PostsService } from './posts.service';
import { PostType, RoomType } from './post.entity';
import { Gender } from '../users/user.entity';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get(':id')
    @ApiOkResponse({ description: 'Get post successfully', type: PostDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    @ApiNotFoundResponse({ description: 'Post not found'})
    async getPost(@Param('id', ParseIntPipe) id: number) {
        const post = await this.postsService.findOne({id});
        if (!post) throw new NotFoundException();
        return post;
    }

    @Post()
    @ApiOkResponse({ description: 'Create new post successfully', type: PostDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    createPost(@Body() postDto: PostDto, @Req() req) {
        return this.postsService.create(postDto, req.user);
    }
    
    @Put(':id')
    @ApiOkResponse({ description: 'Update post information successfully'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    @ApiNotFoundResponse({ description: 'Post not found'})
    updatePost(@Param('id', ParseIntPipe) id: number, @Body() postDto: UpdatePostDto) {
        return this.postsService.update(id, postDto);
    }
    
    @Delete(':id')
    @ApiOkResponse({ description: 'Delete post successfully'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    @ApiNotFoundResponse({ description: 'Post not found'})
    deletePost(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.delete(id);
    }

    @Get()
    @ApiQuery({ name: 'postType', required: true, type: String, enum: PostType })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'sortBy', required: false, type: String, enum: ['time', 'price-desc', 'price-asc'] })
    @ApiQuery({ name: 'name', required: false, type: String })
    @ApiQuery({ name: 'roomType', required: false, type: String, enum: RoomType })
    @ApiQuery({ name: 'gender', required: false, type: String, enum: Gender })
    @ApiQuery({ name: 'utilities', required: false, type: String })
    @ApiQuery({ name: 'interior', required: false, type: String })
    @ApiQuery({ name: 'address', required: false, type: String })
    @ApiQuery({ name: 'priceFrom', required: false, type: Number })
    @ApiQuery({ name: 'priceTo', required: false, type: Number })
    @ApiOkResponse({ description: 'Get posts successfully', type: [PostDto] })
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    getPosts(
        @Query('postType') postType: string,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number, 
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number, 
        @Query('sortBy') sortBy?: "time" | "price-desc" | "price-asc", 
        @Query('name') name?: string,
        @Query('roomType') roomType?: string,
        @Query('gender') gender?: string,
        @Query('utilities') utilities?: string,
        @Query('interior') interior?: string,
        @Query('address') address?: string,
        @Query('priceFrom', new ParseIntPipe({optional: true})) priceFrom?: number,
        @Query('priceTo', new ParseIntPipe({optional: true})) priceTo?: number
    ) {
        return this.postsService.get(
            postType,
            offset, 
            limit, 
            sortBy,
            name,
            roomType,
            gender,
            utilities,
            interior,
            address,
            priceFrom,
            priceTo
        );
    }

    @Post(':id/pictures')
    @ApiBody({ description: 'Upload pictures', type: FilesUploadDto})
    @ApiOkResponse({ description: 'Upload pictures successfully', type: [String]})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    @UseInterceptors(
        FilesInterceptor('files', 20, {
            storage: diskStorage({
                destination: './pictures',
                filename: (req, file, callback) => {
                    const pictureId = uuidv4();
                    const id = req.params.id;
                    const filename = `${id}-${pictureId}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`;
                    callback(null, filename);
                },
            }),
        }),
    )
    async uploadPicture(@Param('id', ParseIntPipe) id: number, @UploadedFiles() files: Array<Express.Multer.File>) {
        if (!files) {
            throw new NotFoundException('File not found');
        }
        return this.postsService.getPicturesById(id);
    }

    @Delete(':id/pictures/:filename')
    @ApiOkResponse({ description: 'Delete picture successfully'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    @ApiNotFoundResponse({ description: 'Picture not found'})
    async deletePicture(@Param('id', ParseIntPipe) id: number, @Param('filename') filename: string) {
        return this.postsService.deletePicture(id, filename);
    }
}
