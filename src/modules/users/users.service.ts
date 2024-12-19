import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from '../auth/auth.dto';
import { User } from './user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './user.dto';
import { Post } from '../posts/post.entity';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,
    ) {}

    async findOne(findOptions: FindOptionsWhere<User>): Promise<User> {
        return await this.usersRepository.findOneBy(findOptions);
    }

    async create(userDto: SignUpDto): Promise<User> {
        const user = this.usersRepository.create(userDto);
        await this.usersRepository.save(user);
        return user;
    }

    async update(id: number, user: UserDto): Promise<boolean> {
        let updateResult = await this.usersRepository.update(id, user);
        if (updateResult.affected == 0) throw new UnauthorizedException();
        return;
    }

    async delete(id: number): Promise<boolean> {
        let deleteResult = await this.usersRepository.update(id, {deleted: true});
        if (deleteResult.affected == 0) throw new UnauthorizedException();
        return;
    }

    async getPostsByUser(userId: number) {
        return await this.postsRepository.find({
            where: {
                postedBy: { id: userId }
            }
        });
    }
}
