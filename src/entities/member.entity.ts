import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, JoinColumn } from "typeorm";
import { MemberGameItemEntity } from "./member-game-item.entity";
import { uniqueId } from "@utilities";


@Entity("member")
export class MemberEntity extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string = uniqueId.generateV4UUID();


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
    carPlusPoint: number = 0;


    @Column("datetime2", {
        nullable: false,
        default: "GETDATE()",
        name: "date_created"
    })
    dateCreated: Date = new Date();


    @Column("datetime2", {
        nullable: false,
        default: "GETDATE()",
        name: "date_updated"
    })
    dateUpdated: Date = new Date();


    @Column("decimal", {
        default: 0,
        name: "experience"
    })
    experience: number = 0;


    @Column("decimal", {
        default: 0,
        name: "game_point"
    })
    gamePoint: number = 0;


    @Column("int", {
        nullable: false,
        default: "1",
        name: "level"
    })
    level: number = 1;


    @Column("nvarchar", {
        nullable: false,
        length: 50,
        default: "",
        name: "nick_name"
    })
    nickName: string = "";

    @OneToMany(type => MemberGameItemEntity, MemberGameItemEntity => MemberGameItemEntity.member)
    @JoinColumn({
        referencedColumnName: "member_id",
        name: 'id'
    })
    memberGameItems: MemberGameItemEntity[]
}
