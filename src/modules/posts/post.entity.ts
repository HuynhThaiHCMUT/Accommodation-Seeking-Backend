import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "../users/user.entity"

export enum RoomType {
    ROOM = "Phòng trọ",
    HOUSE = "Nhà nguyên căn",
    HOMESTAY = "Homestay",
    APARTMENT = "Chung cư",
    MINI_APARTMENT = "Chung cư mini",
}

export enum PostType {
    ROOM = "Phòng",
    SHARE = "Ở ghép",
}

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    deleted: boolean
    @Column()
    description: string
    @Column()
    address: string
    @Column("int")
    price: number
    @Column()
    area: string
    @Column("int")
    capacity: number
    @Column({
        type: "enum",
        enum: RoomType,
    })
    roomType: string
    @Column({
        type: "enum",
        enum: PostType,
    })
    postType: string
    @Column()
    postedAt: Date
    @ManyToOne(() => User, user => user.id)
    postedBy: User
}