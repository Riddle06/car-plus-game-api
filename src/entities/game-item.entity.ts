import { Index, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId } from "typeorm";


@Entity("game_item", { schema: "carPlusGame" })
export class game_item {

    @Column("datetime", {
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        name: "date_created"
    })
    dateCreated: Date;


    @Column("varchar", {
        nullable: false,
        primary: true,
        length: 50,
        name: "id"
    })
    id: string;


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


    @Column("float", {
        nullable: false,
        default: "0",
        precision: 12,
        name: "point"
    })
    point: number;


    @Column("enum", {
        nullable: false,
        default: "role",
        enum: ["role", "tool"],
        name: "type"
    })
    type: string;

}
