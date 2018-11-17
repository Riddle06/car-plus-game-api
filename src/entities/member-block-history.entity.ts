import { MemberEntity } from './member.entity';
import { Index, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId, BaseEntity } from "typeorm";


@Entity("member_block_history")
export class MemberBlockHistoryEntity extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("uniqueidentifier", {
        nullable: false,
        name: "member_id"
    })
    memberId: string

    @Column("nvarchar", {
        nullable: false,
        name: "reason",
        length: 500
    })
    reason: string

    @Column("bit", {
        nullable: false,
        name: "is_deleted",
        default: "0"
    })
    isDeleted: boolean

    @Column("nvarchar", {
        nullable: false,
        name: "admin_user_name",
        default: "",
        length: 100
    })
    adminUserName: string

    @Column("uniqueidentifier", {
        nullable: false,
        name: "admin_user_id"
    })
    adminUserId: string

    @Column("datetime2", {
        nullable: false,
        name: "date_created"
    })
    dateCreated: Date

    @Column("datetime2", {
        nullable: false,
        name: "date_updated"
    })
    dateUpdated: Date

    @Column("nvarchar", {
        nullable: true,
        name: "delete_admin_user_name",
        default: null,
        length: 100
    })
    deleteAdminUserName: string

    @Column("uniqueidentifier", {
        nullable: true,
        name: "delete_admin_user_id"
    })
    deleteAdminUserId: string

    @ManyToOne(type => MemberEntity)
    @JoinColumn({
        name: "member_id"
    })
    member: MemberEntity
}
