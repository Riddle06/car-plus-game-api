import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";


@Entity("game", { schema: "carPlusGame" })
export class GameEntity extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("text", {
        nullable: false,
        name: "description",
        default: ""
    })
    description: string;


    @Column("varchar", {
        nullable: false,
        length: 500,
        default: "",
        name: "game_cover_image_url"
    })
    gameCoverImageUrl: string;

    @Column("varchar", {
        nullable: false,
        length: 45,
        default: "",
        name: "name"
    })
    name: string;


    @Column("json", {
        nullable: false,
        name: "parameters"
    })
    parameters: Object;

}
