import { Entity, Column, BaseEntity, PrimaryColumn } from "typeorm";


@Entity("member_game_item", { schema: "carPlusGame" })
export class MemberGameItemEntity extends BaseEntity {
    
    @PrimaryColumn()
    @Column("varchar", {
        nullable: false,
        primary: true,
        length: 50,
        name: "game_item_id"
    })
    gameItemId: string;

    @PrimaryColumn()
    @Column("varchar", {
        nullable: false,
        primary: true,
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



}
