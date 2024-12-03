import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PostDto } from './post.dto';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get(':id')
    @ApiOkResponse({ description: 'Get post by id', type: PostDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    @ApiNotFoundResponse({ description: 'Post not found'})
    getPosts(@Param() id: number) {
        
    }

    @Post()
    @ApiOkResponse({ description: 'Create new post', type: PostDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    createPost(@Body() postDto: PostDto) {
        
    }

    
    @Put(':id')
    @ApiOkResponse({ description: 'Update post information'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    @ApiNotFoundResponse({ description: 'Post not found'})
    updatePost(@Param() id: number, @Body() postDto: PostDto) {
        
    }
    
    @Delete(':id')
    @ApiOkResponse({ description: 'Delete post'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    @ApiNotFoundResponse({ description: 'Post not found'})
    deletePost(@Param() id: number) {
        
    }
}
