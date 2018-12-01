import { MemberEntity } from '@entities/member.entity';
import { GameItemEntity } from '@entities/game-item.entity';
import { Index, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId, BaseEntity } from "typeorm";


@Entity("member_game_item_order")
export class MemberGameItemOrderEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column("uniqueidentifier", {
        nullable: false,
        name: "member_id"
    })
    memberId: string

    @Column("uniqueidentifier", {
        nullable: true,
        name: "game_item_id"
    })
    gameItemId: string

    @Column("int", {
        nullable: false,
        name: "point_type",
        default: 0
    })
    pointType: number

    @Column("int", {
        nullable: false,
        name: "game_item_count",
        default: 0
    })
    gameItemCount: number

    @Column("decimal", {
        nullable: false,
        name: "point_amount",
        default: 0
    })
    pointAmount: number

    @Column("datetime2", {
        nullable: false,
        name: "date_created"
    })
    dateCreated: Date

    @Column("uniqueidentifier", {
        nullable: false,
        name: "member_game_point_history_id"
    })
    memberGamePointHistoryId: string

    @Column("uniqueidentifier", {
        nullable: false,
        name: "member_game_item_id"
    })
    memberGameItemId: string

    @OneToOne(type => GameItemEntity)
    @JoinColumn({
        name: "game_item_id"
    })
    gameItem: GameItemEntity
    

    @OneToOne(type => MemberEntity)
    @JoinColumn({
        name: "member_id"
    })
    member: MemberEntity
}
