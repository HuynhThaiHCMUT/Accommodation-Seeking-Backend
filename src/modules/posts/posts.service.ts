import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, FindOptionsWhere, LessThanOrEqual, Like, MoreThanOrEqual, Or, Repository } from 'typeorm';
import { PostDto, UpdatePostDto } from './post.dto';
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

    async get(
        offset: number = 0, 
        limit: number = 10, 
        sortBy?: 'time' | 'price-desc' | 'price-asc', 
        roomType?: string,
        utilities?: string,
        address?: string,
        priceFrom?: number,
        priceTo?: number
    ) {
        let order: { [key: string]: 'ASC' | 'DESC' } = {};
        switch (sortBy) {
            case 'price-asc':
                order.price = 'ASC';
                break;
            case 'price-desc':
                order.price = 'DESC';
                break;
            default:
                order.postedAt = 'DESC';
                break;
        }
        let where: FindOptionsWhere<Post> = {};
        if (roomType) {
            where.roomType = roomType;
        }
        if ((typeof utilities === 'string') && utilities.length > 0) {
            let utilitiesArray = utilities.split(',');
            where.utilities = Like(`%${utilitiesArray[0]}%`);
            for (let utility of utilitiesArray) {
                where.utilities = Or(where.utilities, Like(`%${utility}%`));
            }
        }
        if (address) {
            where.address = Like(`%${address}%`);
        }
        if (priceFrom && priceTo) {
            where.price = And(MoreThanOrEqual(priceFrom), LessThanOrEqual(priceTo));
        } else if (priceFrom) {
            where.price = MoreThanOrEqual(priceFrom);
        } else if (priceTo) {
            where.price = LessThanOrEqual(priceTo);
        }
        return await this.postsRepository.find({
            skip: offset,
            take: limit,
            order,
            where
        });
    }
}
