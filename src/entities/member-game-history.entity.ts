import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";


@Entity("member_game_history", { schema: "carPlusGame" })
export class MemberGameHistoryEntity extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("decimal", {
        default: 0,
        nullable: false,
        name: "after_experience"
    })
    afterExperience: number;


    @Column("int", {
        nullable: false,
        default: "0",
        name: "after_level"
    })
    afterLevel: number;


    @Column("decimal", {
        default: 0,
        nullable: false,
        name: "before_experience"
    })
    beforeExperience: number;


    @Column("int", {
        nullable: false,
        default: "0",
        name: "before_level"
    })
    beforeLevel: number;


    @Column("decimal", {
        default: 0,
        nullable: false,
        name: "change_experience"
    })
    changeExperience: number;


    @Column("int", {
        nullable: false,
        default: "0",
        name: "change_level"
    })
    changeLevel: number;


    @Column("datetime", {
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        name: "date_created"
    })
    dateCreated: Date;


    @Column("datetime", {
        nullable: true,
        name: "date_finished"
    })
    dateFinished: Date | null;


    @Column("varchar", {
        nullable: false,
        length: 50,
        name: "game_id"
    })
    gameId: string;


    @Column("decimal", {
        default: 0,
        name: "game_score"
    })
    gameScore: number;

    @Column("varchar", {
        nullable: false,
        length: 50,
        name: "member_id"
    })
    memberId: string;

}
