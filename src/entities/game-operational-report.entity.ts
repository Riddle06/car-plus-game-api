import { Index, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";


@Entity("game_operational_report")
export class GameOperationalReportEntity extends BaseEntity {


    @PrimaryColumn({
        type: "datetime",
        name: "date_record"
    })
    dateRecord: Date

    @Column({
        type: "int",
        name: "login_times",
        default: 0,
        nullable: false
    })
    loginTimes: number

    @Column({
        type: "int",
        name: "game_times",
        default: 0,
        nullable: false
    })
    gameTimes: number

    @Column({
        type: "int",
        name: "catch_game_times",
        default: 0,
        nullable: false
    })
    catchGameTimes: number

    @Column({
        type: "decimal",
        name: "catch_game_score",
        default: 0,
        nullable: false
    })
    catchGameScore: number

    @Column({
        type: "decimal",
        name: "catch_game_point",
        default: 0,
        nullable: false
    })
    catchGamePoint: number

    @Column({
        type: "int",
        name: "shot_game_times",
        default: 0,
        nullable: false
    })

    shotGameTimes: number

    @Column({
        type: "decimal",
        name: "shot_game_score",
        default: 0,
        nullable: false
    })
    shotGameScore: number

    @Column({
        type: "decimal",
        name: "shot_game_point",
        default: 0,
        nullable: false
    })
    shotGamePoint: number


    @Column({
        type: "decimal",
        name: "cost_game_point",
        default: 0,
        nullable: false
    })
    costGamePoint: number

    @Column({
        type: "decimal",
        name: "cost_car_plus_point",
        default: 0,
        nullable: false
    })
    costCarPlusPoint: number
}
