import { Entity, Column, BaseEntity, PrimaryColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { GameItemEntity } from "./game-item.entity";
import { MemberEntity } from "./member.entity";


@Entity("member_game_item", { schema: "carPlusGame" })
export class MemberGameItemEntity extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string


    @Column("varchar", {
        nullable: false,
        length: 50,
        name: "game_item_id"
    })
    gameItemId: string;


    @Column("varchar", {
        nullable: false,
        length: 50,
        name: "member_id"
    })
    memberId: string;


    @Column("varchar", {
        nullable: true,
        length: 50,
        name: "member_game_point_history_id"
    })
    memberGamePointHistoryId: string | null;


    @Column("datetime", {
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        name: "date_created"
    })
    dateCreated: Date = new Date();


    @Column("datetime", {
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        name: "date_updated"
    })
    dateUpdated: Date = new Date();


    @Column("tinyint", {
        nullable: false,
        name: "enabled"
    })
    enabled: boolean = false;

    @Column("int", {
        name: "total_used_times",
        nullable: false,
        default: -1
    })
    totalUsedTimes: number

    @Column("int", {
        name: "remain_times",
        nullable: false,
        default: -1
    })
    remainTimes: number

    @Column("datetime", {
        name: "date_last_used",
        nullable: false
    })
    dateLastUsed: Date

    @Column("tinyint", {
        name: "is_using",
        nullable: false,
        default: false
    })
    isUsing: boolean

    @OneToOne(type => GameItemEntity)
    @JoinColumn({
        name: "game_item_id"
    })
    gameItem: GameItemEntity

    @ManyToOne(type => MemberEntity, MemberEntity => MemberEntity.id)
    @JoinColumn({
        name: "member_id"
    })
    member: MemberEntity
}
