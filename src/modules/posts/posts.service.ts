import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, FindOptionsWhere, LessThanOrEqual, Like, MoreThanOrEqual, Or, Repository } from 'typeorm';
import { PostDto, PostFilterDto, UpdatePostDto } from './post.dto';
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
        const convertedPost = {...post, utilities: post.utilities.join(',')};
        const newPost = this.postsRepository.create(convertedPost);
        await this.postsRepository.save(newPost);
        return newPost;
    }

    async update(id: number, post: UpdatePostDto) {
        const convertedPost = {...post, utilities: post.utilities.join(',')};
        let updateResult = await this.postsRepository.update(id, convertedPost);
        if (updateResult.affected == 0) throw new NotFoundException();
        return;
    }

    async delete(id: number) {
        let deleteResult = await this.postsRepository.delete(id);
        if (deleteResult.affected == 0) throw new NotFoundException();
        return;
    }

    async getByOffset(offset: number, limit: number, sortBy: 'time' | 'price-desc' | 'price-asc', filter: PostFilterDto) {
        let order: { [key: string]: 'ASC' | 'DESC' } = {};
        if (sortBy == 'time') {
            order.postedAt = 'DESC';
        } else if (sortBy == 'price-desc') {
            order.price = 'DESC';
        } else if (sortBy == 'price-asc') {
            order.price = 'ASC';
        }
        let where: FindOptionsWhere<Post> = {};
        if (filter.roomType) {
            where.roomType = filter.roomType;
        }
        if (filter.utilities.length > 0) {
            where.utilities = Like(`%${filter.utilities[0]}%`);
            for (let utility of filter.utilities) {
                where.utilities = Or(where.utilities, Like(`%${utility}%`));
            }
        }
        if (filter.address) {
            where.address = filter.address;
        }
        if (filter.priceFrom && filter.priceTo) {
            where.price = And(MoreThanOrEqual(filter.priceFrom), LessThanOrEqual(filter.priceTo));
        } else if (filter.priceFrom) {
            where.price = MoreThanOrEqual(filter.priceFrom);
        } else if (filter.priceTo) {
            where.price = LessThanOrEqual(filter.priceTo);
        }
        return this.postsRepository.find({
            skip: offset,
            take: limit,
            order,
            where
        });
    }
}
