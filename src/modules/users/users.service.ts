import { Injectable } from '@nestjs/common';
import { SignUpDto } from '../auth/auth.dto';
import { User } from './user.entity';


@Injectable()
export class UsersService {
    private readonly users: User[] = [];

    async findOne(phone: string): Promise<User | undefined> {
        return this.users.find(user => user.phone === phone);
    }

    async create(user: SignUpDto): Promise<User> {
        return this.users[0];
    }
}
