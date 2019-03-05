import { Index, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId, BaseEntity } from "typeorm";


@Entity("admin_user")
export class AdminUserEntity extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", {
        nullable: false,
        length: 50,
        name: "name"
    })
    name: string

    @Column("varchar", {
        nullable: false,
        length: 50,
        name: "account"
    })
    account: string

    @Column("varchar", {
        nullable: false,
        length: 500,
        name: "password"
    })
    password: string


    @Column("datetime", {
        nullable: false,
        name: "date_created",
        default: "GETDATE()"
    })
    dateCreated: Date

    @Column("datetime", {
        nullable: false,
        name: "date_updated",
        default: "GETDATE()"
    })
    dateUpdated: Date
}
