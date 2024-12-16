import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PostDto, UpdatePostDto } from './post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,
    ) {}

    async findOne(findOptions: FindOptionsWhere<Post>) {
        return this.postsRepository.findOneBy(findOptions);
    }

    async create(post: PostDto) {
        const newPost = this.postsRepository.create(post);
        await this.postsRepository.save(newPost);
        return newPost;
    }

    async update(id: number, post: UpdatePostDto) {
        let updateResult = await this.postsRepository.update(id, post);
        if (updateResult.affected == 0) throw new NotFoundException();
        return;
    }

    async delete(id: number) {
        let deleteResult = await this.postsRepository.delete(id);
        if (deleteResult.affected == 0) throw new NotFoundException();
        return;
    }

    async getByOffset(offset: number, limit: number) {
        return this.postsRepository.find({
            skip: offset,
            take: limit,
            order: { postedAt: 'DESC' },
        });
    }
}
