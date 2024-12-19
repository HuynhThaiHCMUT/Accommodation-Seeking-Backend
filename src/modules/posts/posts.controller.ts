import { Body, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PostDto, UpdatePostDto } from './post.dto';
import { PostsService } from './posts.service';

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
    @ApiOkResponse({ description: 'Get posts successfully', type: [PostDto] })
    @ApiUnauthorizedResponse({ description: 'Unauthorized'})
    getPosts(
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number, 
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number, 
        @Query('sortBy') sortBy?: "time" | "price-desc" | "price-asc", 
        @Query('roomType') roomType?: string,
        @Query('utilities') utilities?: string,
        @Query('address') address?: string,
        @Query('priceFrom', new ParseIntPipe({optional: true})) priceFrom?: number,
        @Query('priceTo', new ParseIntPipe({optional: true})) priceTo?: number
    ) {
        return this.postsService.get(
            offset, 
            limit, 
            sortBy,
            roomType,
            utilities,
            address,
            priceFrom,
            priceTo
        );
    }
}
