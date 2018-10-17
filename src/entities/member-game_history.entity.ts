import { Index, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId } from "typeorm";


@Entity("member_game_history", { schema: "carPlusGame" })
export class member_game_history {

    @Column("float", {
        nullable: false,
        default: "0",
        precision: 12,
        name: "after_experience"
    })
    afterExperience: number;


    @Column("int", {
        nullable: false,
        default: "0",
        name: "after_level"
    })
    afterLevel: number;


    @Column("float", {
        nullable: false,
        default: "0",
        precision: 12,
        name: "before_experience"
    })
    beforeExperience: number;


    @Column("int", {
        nullable: false,
        default: "0",
        name: "before_level"
    })
    beforeLevel: number;


    @Column("float", {
        nullable: false,
        default: "0",
        precision: 12,
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


    @Column("float", {
        nullable: false,
        default: "0",
        precision: 12,
        name: "game_score"
    })
    gameScore: number;


    @Column("varchar", {
        nullable: false,
        primary: true,
        length: 50,
        name: "id"
    })
    id: string;


    @Column("varchar", {
        nullable: false,
        length: 50,
        name: "member_id"
    })
    memberId: string;

}
