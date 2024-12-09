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
        const user = await this.usersRepository.findOneBy(findOptions);
        return user;
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
        let deleteResult = await this.usersRepository.delete(id);
        if (deleteResult.affected == 0) throw new UnauthorizedException();
        return;
    }
}
