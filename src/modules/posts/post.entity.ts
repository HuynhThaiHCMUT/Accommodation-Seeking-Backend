import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Gender, User } from "../users/user.entity"

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
    @Column({default: false})
    deleted: boolean
    @Column()
    description: string
    @Column()
    address: string
    @Column({
        enum: Gender, 
        nullable: true,
    })
    gender: string
    @Column("int")
    price: number
    @Column("int")
    deposit: number
    @Column("int")
    floor: number
    @Column("int")
    capacity: number
    @Column()
    area: number
    @Column()
    utilities: string
    @Column()
    interior: string
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

    pictures?: string[];
}