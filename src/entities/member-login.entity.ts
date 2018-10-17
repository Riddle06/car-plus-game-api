import { Entity, Column, BaseEntity, PrimaryColumn } from "typeorm";


@Entity("member_login", { schema: "carPlusGame" })
export class MemberLoginEntity extends BaseEntity {

    @PrimaryColumn("varchar", {
        nullable: false,
        length: 50,
        name: "member_id"
    })
    memberId: string;

    @PrimaryColumn("varchar", {
        nullable: false,
        length: 50,
        name: "client_id"
    })
    clientId: string;


    @Column("datetime", {
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        name: "date_created"
    })
    dateCreated: Date;


    @Column("datetime", {
        nullable: true,
        name: "date_last_logout"
    })
    dateLastLogout: Date | null;


    @Column("datetime", {
        nullable: false,
        default: "CURRENT_TIMESTAMP",
        name: "date_updated"
    })
    dateUpdated: Date;


    @Column("bit", {
        nullable: false,
        default: "0",
        name: "is_logout"
    })
    isLogout: boolean;




}
