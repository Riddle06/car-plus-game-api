import { Entity, Column, BaseEntity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { MemberEntity } from "./member.entity";


@Entity("member_login")
export class MemberLoginEntity extends BaseEntity {

    @PrimaryColumn("uniqueidentifier", {
        nullable: false,
        name: "member_id"
    })
    memberId: string;

    @PrimaryColumn("uniqueidentifier", {
        nullable: false,
        name: "client_id"
    })
    clientId: string;


    @Column("datetime2", {
        nullable: false,
        default: "GETDATE()",
        name: "date_created"
    })
    dateCreated: Date;


    @Column("datetime2", {
        nullable: true,
        name: "date_last_logout"
    })
    dateLastLogout: Date | null;


    @Column("datetime2", {
        nullable: false,
        default: "GETDATE()",
        name: "date_updated"
    })
    dateUpdated: Date;


    @Column("bit", {
        nullable: false,
        default: "0",
        name: "is_logout"
    })
    isLogout: boolean;

    @ManyToOne(type => MemberEntity)
    @JoinColumn({
        name: "member_id"
    })
    member: MemberEntity

}   
