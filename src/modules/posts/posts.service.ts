import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, FindOptionsWhere, LessThanOrEqual, Like, MoreThanOrEqual, Or, Repository } from 'typeorm';
import { PostDto, PostFilterDto, UpdatePostDto } from './post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
    private readonly logger = new Logger(PostsService.name);

    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,
    ) {}

    async findOne(findOptions: FindOptionsWhere<Post>) {
        return await this.postsRepository.findOneBy(findOptions);
    }

    async create(post: PostDto, user: any) {
        // DEVELOPMENT: If user is not provided, use the first user
        if (!user) {
            user = { id: 1 };
        }
        const convertedPost = {
            ...post,
            postedAt: new Date(),
            postedBy: user,
        };
        const newPost = this.postsRepository.create(convertedPost);
        await this.postsRepository.save(newPost);
        return newPost;
    }

    async update(id: number, post: UpdatePostDto) {

        let updateResult = await this.postsRepository.update(id, post);
        if (updateResult.affected == 0) throw new NotFoundException();
        return;
    }

    async delete(id: number) {
        let deleteResult = await this.postsRepository.update(id, { deleted: true });
        if (deleteResult.affected == 0) throw new NotFoundException();
        return;
    }

    async getByOffset(
        offset: number = 0, 
        limit: number = 10, 
        sortBy?: 'time' | 'price-desc' | 'price-asc', 
        filter?: PostFilterDto
    ) {
        this.logger.log(JSON.stringify(offset));
        let order: { [key: string]: 'ASC' | 'DESC' } = {};
        if (sortBy == 'time' || !sortBy) {
            order.postedAt = 'DESC';
        } else if (sortBy == 'price-desc') {
            order.price = 'DESC';
        } else if (sortBy == 'price-asc') {
            order.price = 'ASC';
        }
        let where: FindOptionsWhere<Post> = {};
        if (filter?.roomType) {
            where.roomType = filter.roomType;
        }
        if ((typeof filter?.utilities === 'string') && filter.utilities.length > 0) {
            let utilities = filter.utilities.split(',');
            where.utilities = Like(`%${utilities[0]}%`);
            for (let utility of utilities) {
                where.utilities = Or(where.utilities, Like(`%${utility}%`));
            }
        }
        if (filter?.address) {
            where.address = Like(`%${filter.address}%`);
        }
        if (filter?.priceFrom && filter.priceTo) {
            where.price = And(MoreThanOrEqual(filter.priceFrom), LessThanOrEqual(filter.priceTo));
        } else if (filter?.priceFrom) {
            where.price = MoreThanOrEqual(filter.priceFrom);
        } else if (filter?.priceTo) {
            where.price = LessThanOrEqual(filter.priceTo);
        }
        return await this.postsRepository.find({
            skip: offset,
            take: limit,
            order,
            where
        });
    }
}
