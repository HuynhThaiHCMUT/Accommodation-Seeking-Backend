import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Post } from "../posts/post.entity"

export enum Gender {
    MALE = "Nam",
    FEMALE = "Nữ",
    OTHER = "Khác"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number
    @Column({length: 40})
    firstName: string
    @Column({length: 40})
    lastName: string
    @Column()
    deleted: boolean
    @Column()
    email: string
    @Column({length: 15})
    phone: string
    @Column({
        type: "enum",
        enum: Gender,
    })
    gender: string
    @Column()
    birthdate: Date
    @Column()
    picture: string
    @Column()
    password: string
    @OneToMany(() => Post, post => post.postedBy)
    posts: Post[]
}