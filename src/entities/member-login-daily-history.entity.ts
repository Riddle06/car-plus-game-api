import { Index, Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";


@Entity("member_login_daily_history")
export class MemberLoginDailyHistory extends BaseEntity {
    
    @PrimaryColumn({
        type: "uuid",
        name: "member_id"
    })
    memberId: string

    @PrimaryColumn({
        type: "datetime2",
        name: "date_record"
    })
    dateRecord: Date

    @Column({
        type: "datetime2",
        name: "date_created",
        default: "GETDATE()",
        nullable: false
    })
    dateCreated: Date

    @Column({
        type: "datetime2",
        name: "date_updated",
        default: "GETDATE()",
        nullable: false
    })
    dateUpdated: Date

    @Column({
        type: "int",
        name: "login_times",
        default: 0,
        nullable: false
    })
    loginTimes: number
}
