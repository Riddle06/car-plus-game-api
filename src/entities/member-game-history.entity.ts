import { MemberEntity } from '@entities/member.entity';
import { MemberGamePointHistoryEntity } from '@entities/member-game-point-history.entity';
import { MemberGameHistoryGameItemEntity } from './member-game-history-game-item.entity';
import { GameEntity } from '@entities/game.entity';
import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";


@Entity("member_game_history")
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


    @Column("datetime2", {
        nullable: false,
        default: "GETDATE()",
        name: "date_created"
    })
    dateCreated: Date;


    @Column("datetime2", {
        nullable: true,
        name: "date_finished"
    })
    dateFinished: Date | null;


    @Column("uniqueidentifier", {
        nullable: false,
        name: "game_id"
    })
    gameId: string;


    @Column("decimal", {
        default: 0,
        name: "game_score"
    })
    gameScore: number;

    @Column("decimal", {
        default: 0,
        name: "game_point"
    })
    gamePoint: number

    @Column("uniqueidentifier", {
        nullable: false,
        name: "member_id"
    })
    memberId: string;

    @OneToOne(type => GameEntity, GameEntity => GameEntity.id)
    @JoinColumn({
        name: "game_id",
    })
    game: GameEntity

    @OneToOne(type => MemberEntity, MemberEntity => MemberEntity.id)
    @JoinColumn({
        name: "member_id",
    })
    member: MemberEntity


    @OneToMany(type => MemberGameHistoryGameItemEntity, MemberGameHistoryGameItemEntity => MemberGameHistoryGameItemEntity.memberGameHistoryId)
    @JoinColumn({
        name: "id",
        referencedColumnName: 'member_game_history_id'
    })
    memberGameHistoryGameItems: MemberGameHistoryGameItemEntity[]

}
