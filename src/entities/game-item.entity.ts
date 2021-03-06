import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";
import { GameItemType } from '../view-models/game.vm';


@Entity("game_item")
export class GameItemEntity extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")

    id: string;


    @Column("datetime", {
        nullable: false,
        default: "GETDATE()",
        name: "date_created"
    })
    dateCreated: Date;




    @Column("varchar", {
        nullable: false,
        length: 500,
        default: "",
        name: "image_url"
    })
    imageUrl: string;


    @Column("nvarchar", {
        nullable: false,
        length: 50,
        default: "",
        name: "name"
    })
    name: string;


    @Column("decimal", {
        default: 0,
        name: "game_point"
    })
    gamePoint: number;


    @Column("decimal", {
        default: 0,
        name: "car_plus_point"
    })
    carPlusPoint: number;


    @Column("int", {
        nullable: false,
        default: 0,
        name: "type"
    })
    type: GameItemType;


    @Column("bit", {
        name: "enabled_add_score_rate",
        nullable: false,
        default: false
    })
    enabledAddScoreRate: boolean;

    @Column("bit", {
        name: "enabled_add_game_point_rate",
        nullable: false,
        default: false
    })
    enabledAddGamePointRate: boolean;

    @Column("float", {
        name: "add_score_rate",
        nullable: true,
        default: null
    })
    addScoreRate: number | null;

    @Column("float", {
        name: "add_game_point_rate",
        nullable: true,
        default: 0
    })

    addGamePointRate: number | null


    @Column("int", {
        name: "used_times",
        nullable: false,
        default: -1
    })
    usedTimes: number

    @Column("int", {
        name: "level_min_limit",
        nullable: false,
        default: -1
    })
    levelMinLimit: number = -1


    @Column("nvarchar", {
        name: "description",
        length: 1000,
        default: ""
    })
    description: string = ''

    @Column("bit", {
        name: "enabled",
        default: "1"
    })
    enabled: boolean = false;

    @Column("nvarchar", {
        name: "sprite_folder_path",
        default: "500"
    })
    spriteFolderPath: string = ''

    @Column("nvarchar", {
        name: "description_short",
        default: "100"
    })
    descriptionShort: string = ''
}