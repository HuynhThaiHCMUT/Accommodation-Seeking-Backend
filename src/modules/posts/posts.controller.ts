import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { PostDto, UpdatePostDto } from './post.dto';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get(':id')
    @ApiOkResponse({ description: 'Get post successfully', type: PostDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    @ApiNotFoundResponse({ description: 'Post not found'})
    getPost(@Param() id: number) {
        const post = this.postsService.findOne({id});
        if (!post) throw new NotFoundException();
        return post;
    }

    @Post()
    @ApiOkResponse({ description: 'Create new post successfully', type: PostDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    createPost(@Body() postDto: PostDto) {
        return this.postsService.create(postDto);
    }

    
    @Put(':id')
    @ApiOkResponse({ description: 'Update post information successfully'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    @ApiNotFoundResponse({ description: 'Post not found'})
    updatePost(@Param() id: number, @Body() postDto: UpdatePostDto) {
        return this.postsService.update(id, postDto);
    }
    
    @Delete(':id')
    @ApiOkResponse({ description: 'Delete post successfully'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    @ApiNotFoundResponse({ description: 'Post not found'})
    deletePost(@Param() id: number) {
        return this.postsService.delete(id);
    }

    @Get()
    @ApiOkResponse({ description: 'Get posts successfully', type: [PostDto] })
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    getPosts(@Param() offset: number, @Param() limit: number) {
        return this.postsService.getByOffset(offset, limit);
    }
}
