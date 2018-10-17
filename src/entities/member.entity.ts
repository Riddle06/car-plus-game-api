import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";


@Entity("member", { schema: "carPlusGame" })
export class MemberEntity extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;


    @Column("varchar", {
        nullable: true,
        length: 50,
        name: "car_plus_member_id"
    })
    carPlusMemberId: string | null;


    @Column("decimal", {
        default: 0,
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


    @Column("decimal", {
        default: 0,
        name: "experience"
    })
    experience: number;


    @Column("decimal", {
        default: 0,
        name: "game_point"
    })
    gamePoint: number;




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
