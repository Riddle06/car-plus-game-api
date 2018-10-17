import { Index, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId } from "typeorm";


@Entity("member_game_item", { schema: "carPlusGame" })
export class member_game_item {

    @Column("datetime", {
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        name: "date_created"
    })
    dateCreated: Date;


    @Column("datetime", {
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        name: "date_updated"
    })
    dateUpdated: Date;


    @Column("bit", {
        nullable: false,
        name: "enabled"
    })
    enabled: boolean;


    @Column("varchar", {
        nullable: false,
        primary: true,
        length: 50,
        name: "game_item_id"
    })
    gameItemId: string;


    @Column("varchar", {
        nullable: true,
        length: 50,
        name: "member_game_point_history_id"
    })
    memberGamePointHistoryId: string | null;


    @Column("varchar", {
        nullable: false,
        primary: true,
        length: 45,
        name: "member_id"
    })
    memberId: string;

}
