import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import { MemberGameItemEntity } from "./member-game-item.entity";
import { MemberGameHistoryEntity } from "./member-game-history.entity";


@Entity("member_game_history_game_item", { schema: "carPlusGame" })
export class MemberGameHistoryGameItem extends BaseEntity {

    @PrimaryColumn("uuid", {
        length: 50,
        name: 'member_game_item_id'
    })
    memberGameItemId: string

    @PrimaryColumn("uuid", {
        length: 50,
        name: 'member_game_history_id'
    })
    memberGameHistoryId: string

    @Column("datetime", {
        default: "CURRENT_TIMESTAMP",
        nullable: false,
        name: "date_created"
    })
    dateCreated: Date = new Date()

    @Column("datetime", {
        default: "CURRENT_TIMESTAMP",
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
