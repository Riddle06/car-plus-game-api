import { Index, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";


@Entity("game_question")
export class GameQuestionEntity extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;


    @Column("text", {
        nullable: false,
        name: "answer"
    })
    answer: string;

    @Column("nvarchar", {
        nullable: false,
        length: 500,
        default: "",
        name: "question"
    })
    question: string;


    @Column("int", {
        nullable: false,
        default: "0",
        name: "sort"
    })
    sort: number;

}
