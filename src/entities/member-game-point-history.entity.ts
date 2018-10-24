import { Index, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId, BaseEntity } from "typeorm";


@Entity("member_game_point_history")
export class MemberGamePointHistoryEntity extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("decimal", {
        default: 0,
        name: "after_car_plus_point"
    })
    afterCarPlusPoint: number;


    @Column("decimal", {
        default: 0,
        name: "after_game_point"
    })
    afterGamePoint: number;


    @Column("decimal", {
        default: 0,
        name: "before_car_plus_point"
    })
    beforeCarPlusPoint: number;


    @Column("decimal", {
        default: 0,
        name: "before_game_point"
    })
    beforeGamePoint: number;


    @Column("decimal", {
        default: 0,
        name: "change_car_plus_point"
    })
    changeCarPlusPoint: number;


    @Column("decimal", {
        default: 0,
        name: "change_game_point"
    })
    changeGamePoint: number;


    @Column("datetime2", {
        nullable: false,
        default: "GETDATE()",
        name: "date_created"
    })
    dateCreated: Date;


    @Column("nvarchar", {
        nullable: false,
        length: 100,
        default: "",
        name: "description"
    })
    description: string;


    @Column("uniqueidentifier", {
        nullable: true,
        name: "game_item_id"
    })
    gameItemId: string | null;


    @Column("uniqueidentifier", {
        nullable: true,
        
        name: "member_game_item_id"
    })
    memberGameItemId: string | null;

    @Column("uniqueidentifier", {
        nullable: false,
        name: "member_id"
    })
    memberId: string;


    @Column("int", {
        nullable: false,
        default: "0",
        name: "type"
    })
    type: number

}
