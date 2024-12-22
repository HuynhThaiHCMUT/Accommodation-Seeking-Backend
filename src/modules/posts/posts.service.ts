import { promises as fs } from 'fs';
import * as path from 'path';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, FindOptionsWhere, LessThanOrEqual, Like, MoreThanOrEqual, Or, Repository } from 'typeorm';
import { PostDto, UpdatePostDto } from './post.dto';
import { Post } from './post.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
    private readonly logger = new Logger(PostsService.name);
    private readonly picturesDirectory = './pictures';

    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async findOne(findOptions: FindOptionsWhere<Post>): Promise<Post> {
        let post = await this.postsRepository.findOne({
            where: {...findOptions, deleted: false},
            relations: ['postedBy']
        });
        if (post) {
            post.pictures = await this.getPicturesById(post.id);
            post.postedBy.password = undefined;
        }
        return post;
    }

    async create(post: PostDto, user: any): Promise<Post> {
        // DEVELOPMENT: If user is not provided, use the first user
        if (!user) {
            user = { id: 1 };
        }
        const newPost = {
            ...post,
            postedAt: new Date(),
            postedBy: user,
        };
        const createdPost = this.postsRepository.create(newPost);
        await this.postsRepository.save(createdPost);
        await this.usersRepository.update(user.id, { postCount: () => "postCount + 1" });
        return createdPost;
    }

    async update(id: number, post: UpdatePostDto): Promise<void> {
        let updateResult = await this.postsRepository.update(id, post);
        if (updateResult.affected == 0) throw new NotFoundException();
        return;
    }

    async delete(id: number): Promise<void> {
        let deleteResult = await this.postsRepository.update(id, { deleted: true });
        if (deleteResult.affected == 0) throw new NotFoundException();
        return;
    }

    async get(
        postType: string,
        offset: number = 0, 
        limit: number = 10, 
        sortBy?: 'time' | 'price-desc' | 'price-asc', 
        name?: string,
        roomType?: string,
        gender?: string,
        utilities?: string,
        interior?: string,
        address?: string,
        priceFrom?: number,
        priceTo?: number
    ): Promise<Post[]> {
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
        let where: FindOptionsWhere<Post> = {
            deleted: false,
            postType
        };
        if (name) {
            where.name = Like(`%${name}%`);
        }
        if (address) {
            where.address = Like(`%${address}%`);
        }
        if (gender) {
            where.gender = Like(`%${gender}%`);
        }
        if ((typeof roomType === 'string') && roomType.length > 0) {
            let roomTypeArray = roomType.split(',');
            where.roomType = Or(...roomTypeArray.map((value) => Like(`%${value}%`)))
        }
        if ((typeof utilities === 'string') && utilities.length > 0) {
            let utilitiesArray = utilities.split(',');
            where.utilities = And(...utilitiesArray.map((value) => Like(`%${value}%`)))
        }
        if ((typeof interior === 'string') && interior.length > 0) {
            let interiorArray = interior.split(',');
            where.interior = And(...interiorArray.map((value) => Like(`%${value}%`)))
        }
        if (priceFrom && priceTo) {
            where.price = And(MoreThanOrEqual(priceFrom), LessThanOrEqual(priceTo));
        } else if (priceFrom) {
            where.price = MoreThanOrEqual(priceFrom);
        } else if (priceTo) {
            where.price = LessThanOrEqual(priceTo);
        }
        let posts = await this.postsRepository.find({
            skip: offset,
            take: limit,
            order,
            where,
        });
        for (let post of posts) {
            post.pictures = await this.getPicturesById(post.id);
        }
        return posts;
    }

    async getPostsByUser(
        userId: number,
        postType: string,
        offset: number = 0, 
        limit: number = 10, 
    ) {
        let posts = await this.postsRepository.find({
            where: {
                postedBy: { id: userId },
                postType,
                deleted: false,
            },
            skip: offset,
            take: limit,
            order: { postedAt: 'DESC' },
        });
        for (let post of posts) {
            post.pictures = await this.getPicturesById(post.id);
        }
        return posts;
    }

    async getPicturesById(id: number): Promise<string[]> {
        const files = await fs.readdir(this.picturesDirectory);
        return files.filter((file) => file.startsWith(`${id}-`)); // Match files by the ID prefix
    }

    async deletePicture(id: number, filename: string): Promise<void> {
        const filePath = path.join(this.picturesDirectory, filename);

        try {
            await fs.access(filePath); // Check if the file exists
            await fs.unlink(filePath); // Delete the file
            return;
        } catch (error) {
            throw new NotFoundException('File not found');
        }
    }
}
