import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";


@Entity("game_item")
export class GameItemEntity extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;


    @Column("datetime", {
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        name: "date_created"
    })
    dateCreated: Date;




    @Column("varchar", {
        nullable: false,
        length: 500,
        default: "",
        name: "image_url"
    })
    imageUrl: string;


    @Column("varchar", {
        nullable: false,
        length: 50,
        default: "",
        name: "name"
    })
    name: string;


    @Column("decimal", {
        default: 0,
        name: "point"
    })
    point: number;


    @Column("enum", {
        nullable: false,
        default: "role",
        enum: ["role", "tool"],
        name: "type"
    })
    type: "role" | "tool";


    @Column("tinyint", {
        name: "enabled_add_score_rate",
        nullable: false,
        default: false
    })
    enabledAddScoreRate: boolean;

    @Column("tinyint", {
        name: "enabled_add_game_point_rate",
        nullable: false,
        default: false
    })
    enabledAddGamePointRate: boolean;

    @Column("float", {
        name: "add_score_rate",
        nullable: true,
        default: null
    })
    addScoreRate: number | null;

    @Column("float", {
        name: "add_game_point_rate",
        nullable: true,
        default: 0
    })

    addGamePointRate: number | null


    @Column("int", {
        name: "used_times",
        nullable: false,
        default: -1
    })
    usedTimes: number

}
