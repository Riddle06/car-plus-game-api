import { Index, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId } from "typeorm";


@Entity("vars", { schema: "carPlusGame" })
export class vars {

    @Column("varchar", {
        nullable: false,
        length: 200,
        default: "",
        name: "description"
    })
    description: string;


    @Column("varchar", {
        nullable: false,
        primary: true,
        length: 100,
        name: "key"
    })
    key: string;


    @Column("datetime", {
        nullable: true,
        name: "meta_date_1"
    })
    metaDate1: Date | null;


    @Column("datetime", {
        nullable: true,
        name: "meta_date_2"
    })
    metaDate2: Date | null;


    @Column("int", {
        nullable: true,
        name: "meta_int_1"
    })
    metaInt1: number | null;


    @Column("int", {
        nullable: true,
        name: "meta_int_2"
    })
    metaInt2: number | null;


    @Column("varchar", {
        nullable: true,
        length: 100,
        name: "meta_str_1"
    })
    metaStr1: string | null;


    @Column("varchar", {
        nullable: true,
        length: 100,
        name: "meta_str_2"
    })
    metaStr2: string | null;


    @Column("longtext", {
        nullable: true,
        name: "meta_str_long"
    })
    metaStrLong: string | null;

}
