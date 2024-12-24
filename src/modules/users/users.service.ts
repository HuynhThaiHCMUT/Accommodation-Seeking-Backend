import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from '../auth/auth.dto';
import { User } from './user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './user.dto';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findOne(findOptions: FindOptionsWhere<User>): Promise<User> {
        return await this.usersRepository.findOneBy({...findOptions, deleted: false});
    }

    async create(userDto: SignUpDto): Promise<User> {
        const user = this.usersRepository.create(userDto);
        return await this.usersRepository.save(user);
    }

    async uploadAvatar(id: number, picture: string): Promise<string> {
        let updateResult = await this.usersRepository.update(id, {picture});
        if (updateResult.affected == 0) throw new UnauthorizedException();
        return picture;
    }

    async update(id: number, user: UserDto): Promise<boolean> {
        let updateResult = await this.usersRepository.update(id, user);
        if (updateResult.affected == 0) throw new UnauthorizedException();
        return;
    }

    async delete(id: number) {
        let deleteResult = await this.usersRepository.update(id, {deleted: true});
        if (deleteResult.affected == 0) throw new UnauthorizedException();
        return;
    }
}
