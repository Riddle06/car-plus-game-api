import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";


@Entity("game")
export class GameEntity extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("nvarchar", {
        nullable: false,
        name: "description",
        default: ""
    })
    description: string;


    @Column("nvarchar", {
        nullable: false,
        length: 500,
        default: "",
        name: "game_cover_image_url"
    })
    gameCoverImageUrl: string;

    @Column("nvarchar", {
        nullable: false,
        length: 45,
        default: "",
        name: "name"
    })
    name: string;


    @Column("nvarchar", {
        nullable: false,
        name: "parameters",
        length: 1000
    })
    parameters: string;


    @Column("varchar", {
        nullable: false,
        name: "code",
        length: 50
    })
    code: "catch" | "shot";

}
