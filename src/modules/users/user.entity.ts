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
    @Column({default: false})
    deleted: boolean
    @Column({unique: true})
    email: string
    @Column({length: 15, unique: true})
    phone: string
    @Column({type: "enum", enum: Gender})
    gender: string
    @Column()
    birthdate: Date
    @Column({nullable: true})
    picture: string
    @Column()
    password: string
    @OneToMany(() => Post, post => post.postedBy)
    posts: Post[]
}