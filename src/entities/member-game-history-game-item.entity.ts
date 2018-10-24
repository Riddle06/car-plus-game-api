import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import { MemberGameItemEntity } from "./member-game-item.entity";
import { MemberGameHistoryEntity } from "./member-game-history.entity";


@Entity("member_game_history_game_item")
export class MemberGameHistoryGameItem extends BaseEntity {

    @PrimaryColumn("uniqueidentifier", {
        name: 'member_game_item_id'
    })
    memberGameItemId: string

    @PrimaryColumn("uniqueidentifier", {
        name: 'member_game_history_id'
    })
    memberGameHistoryId: string

    @Column("datetime2", {
        default: "GETDATE()",
        nullable: false,
        name: "date_created"
    })
    dateCreated: Date = new Date()

    @Column("datetime2", {
        default: "GETDATE()",
        nullable: false,
        name: "date_updated"
    })
    dateUpdated: Date = new Date()

    @OneToOne((type) => MemberGameItemEntity)
    @JoinColumn({
        referencedColumnName: "id",
        name: "member_game_item_id"
    })
    memberGameItem: MemberGameItemEntity


    @OneToOne((type) => MemberGameItemEntity)
    @JoinColumn({
        referencedColumnName: "id",
        name: "member_game_history_id"
    })
    memberGameHistory: MemberGameHistoryEntity

}
