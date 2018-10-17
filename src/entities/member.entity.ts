import { Index, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId } from "typeorm";


@Entity("member", { schema: "carPlusGame" })
export class member {

    @Column("varchar", {
        nullable: true,
        length: 50,
        name: "car_plus_member_id"
    })
    carPlusMemberId: string | null;


    @Column("float", {
        nullable: false,
        default: "0",
        precision: 12,
        name: "car_plus_point"
    })
    carPlusPoint: number;


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


    @Column("float", {
        nullable: false,
        default: "0",
        precision: 12,
        name: "experience"
    })
    experience: number;


    @Column("float", {
        nullable: false,
        default: "0",
        precision: 12,
        name: "game_point"
    })
    gamePoint: number;


    @Column("varchar", {
        nullable: false,
        primary: true,
        length: 50,
        name: "id"
    })
    id: string;


    @Column("int", {
        nullable: false,
        default: "1",
        name: "level"
    })
    level: number;


    @Column("varchar", {
        nullable: false,
        length: 50,
        default: "",
        name: "nick_name"
    })
    nickName: string;

}
