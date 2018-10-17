import { Index, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId, BaseEntity } from "typeorm";


@Entity("member_game_point_history", { schema: "carPlusGame" })
export class MemberGamePointHistoryEntity extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("decimal", {
        default: 0,
        name: "after_car_plus_point"
    })
    afterCarPlusPoint: number;


    @Column("decimal", {
        default: 0,
        name: "after_game_point"
    })
    afterGamePoint: number;


    @Column("decimal", {
        default: 0,
        name: "before_car_plus_point"
    })
    beforeCarPlusPoint: number;


    @Column("decimal", {
        default: 0,
        name: "before_game_point"
    })
    beforeGamePoint: number;


    @Column("decimal", {
        default: 0,
        name: "change_car_plus_point"
    })
    changeCarPlusPoint: number;


    @Column("decimal", {
        default: 0,
        name: "change_game_point"
    })
    changeGamePoint: number;


    @Column("datetime", {
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        name: "date_created"
    })
    dateCreated: Date;


    @Column("varchar", {
        nullable: false,
        length: 100,
        default: "",
        name: "description"
    })
    description: string;


    @Column("varchar", {
        nullable: true,
        length: 50,
        name: "game_item_id"
    })
    gameItemId: string | null;


    @Column("varchar", {
        nullable: true,
        length: 50,
        name: "game_item_member_id"
    })
    gameItemMemberId: string | null;

    @Column("varchar", {
        nullable: false,
        length: 50,
        name: "member_id"
    })
    memberId: string;


    @Column("enum", {
        nullable: false,
        default: "game",
        enum: ["game", "car_plus_point_transfer_to_game_point", "game_point_transfer_to_car_plus_point", "game_point_transfer_to_game_item"],
        name: "type"
    })
    type: "game" | "car_plus_point_transfer_to_game_point" | "game_point_transfer_to_car_plus_point" | "game_point_transfer_to_game_item";

}
