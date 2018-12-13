import { MemberBlockHistoryEntity } from '@entities/member-block-history.entity';
import { MemberEntity } from '@entities/member.entity';
import { AppError, QueryCountDbModel } from '@view-models/common.vm';
import { QueryRunner } from 'typeorm';
import { BaseConnection } from '@services/base-connection';
import { AdminMemberBlockParameter, AdminMemberBlockHistoryVM, AdminMemberBlockListQueryParameterVM } from '@view-models/admin.member.vm';
import { ListResult, PageQuery, Result } from '@view-models/common.vm';
import { AdminUserToken } from '@view-models/admin.auth.vm';
import { checker, uniqueId } from '@utilities';

const baseSql = `select
history.id as id,
history.member_id as memberId,
history.date_created as dateCreated,
m.nick_name as memberNickName,
history.date_updated as dateUpdated,
history.reason as reason,
history.admin_user_id as adminUserId,
history.admin_user_name as adminUserName,
history.delete_admin_user_id as deleteAdminUserId,
history.delete_admin_user_name as deleteAdminUserName,
history.is_deleted as isDeleted,
ROW_NUMBER () OVER ( order by history.date_created desc) as row
from member_block_history as history
join member as m on m.id = history.member_id`

type MemberBlockHistoryDbViewModel = {
    id: string
    memberId: string
    dateCreated: Date
    memberNickName: string
    dateUpdated: Date
    reason: string
    adminUserId: string
    adminUserName: string
    deleteAdminUserId: string
    deleteAdminUserName: string
    isDeleted: boolean
    row: number
}


export class AdminMemberBlockLibSvc extends BaseConnection {
    private adminUserToken: AdminUserToken = null
    constructor(adminUserToken: AdminUserToken, queryRunner: QueryRunner) {
        super(queryRunner)
        this.adminUserToken = adminUserToken;
    }

    async addMemberBlockHistory(param: AdminMemberBlockParameter): Promise<Result<AdminMemberBlockHistoryVM>> {

        const { memberId, reason, adminUserName } = param;

        if (checker.isNullOrUndefinedOrWhiteSpace(memberId)) {
            throw new AppError('請選擇會員')
        }

        if (checker.isNullOrUndefinedOrWhiteSpace(reason)) {
            throw new AppError('封鎖原因為必填選項')
        }

        if (checker.isNullOrUndefinedOrWhiteSpace(adminUserName)) {
            throw new AppError('經手人為必填')
        }


        const memberRepository = this.entityManager.getRepository(MemberEntity)
        const memberBlockHistoryRepository = this.entityManager.getRepository(MemberBlockHistoryEntity)

        const memberEntity = await memberRepository.findOne(memberId)

        if (checker.isNullOrUndefinedObject(memberEntity)) {
            throw new AppError('查無此會員')
        }

        if (memberEntity.isBlock) {
            throw new AppError('此會員已被封鎖')
        }

        const newMemberBlockHistoryEntity = new MemberBlockHistoryEntity()
        newMemberBlockHistoryEntity.id = uniqueId.generateV4UUID();
        newMemberBlockHistoryEntity.memberId = memberId
        newMemberBlockHistoryEntity.reason = reason
        newMemberBlockHistoryEntity.isDeleted = false
        newMemberBlockHistoryEntity.adminUserName = adminUserName
        newMemberBlockHistoryEntity.adminUserId = this.adminUserToken.payload.id
        newMemberBlockHistoryEntity.dateCreated = new Date()
        newMemberBlockHistoryEntity.dateUpdated = new Date();
        await memberBlockHistoryRepository.insert(newMemberBlockHistoryEntity);

        await this.entityManager.getRepository(MemberEntity).update({ id: memberEntity.id }, {
            dateUpdated: new Date(),
            isBlock: true
        })

        const ret = new Result<AdminMemberBlockHistoryVM>(true)
        ret.item = {
            adminUserId: this.adminUserToken.payload.id,
            adminUserName: adminUserName,
            dateCreated: newMemberBlockHistoryEntity.dateCreated,
            dateUpdated: newMemberBlockHistoryEntity.dateUpdated,
            id: newMemberBlockHistoryEntity.id,
            memberId: newMemberBlockHistoryEntity.memberId,
            isDeleted: newMemberBlockHistoryEntity.isDeleted,
            reason: newMemberBlockHistoryEntity.reason
        }
        return ret;
    }

    async deleteMemberBlockHistory(blockHistoryId: string): Promise<Result<AdminMemberBlockHistoryVM>> {

        if (checker.isNullOrUndefinedOrWhiteSpace(blockHistoryId)) {
            throw new AppError('請輸入識別值')
        }
        const memberRepository = this.entityManager.getRepository(MemberEntity)
        const memberBlockHistoryRepository = this.entityManager.getRepository(MemberBlockHistoryEntity)
        const memberBlockHistoryEntity = await memberBlockHistoryRepository.findOne(blockHistoryId)

        if (checker.isNullOrUndefinedObject(memberBlockHistoryEntity)) {
            throw new AppError('查無此紀錄')
        }

        if (memberBlockHistoryEntity.isDeleted) {
            throw new AppError('此紀錄已被刪除')
        }

        const memberEntity = await memberRepository.findOne(memberBlockHistoryEntity.memberId)

        if (checker.isNullOrUndefinedObject(memberEntity)) {
            throw new AppError('查無會員')
        }

        if (!memberEntity.isBlock) {
            throw new AppError('此會員已是正常狀態')
        }

        memberEntity.isBlock = false
        memberEntity.dateUpdated = new Date();
        await memberEntity.save();

        memberBlockHistoryEntity.deleteAdminUserId = this.adminUserToken.payload.id
        memberBlockHistoryEntity.deleteAdminUserName = '無紀錄'
        await memberBlockHistoryEntity.save()

        const ret = new Result<AdminMemberBlockHistoryVM>(true)
        ret.item = {
            adminUserId: this.adminUserToken.payload.id,
            adminUserName: memberBlockHistoryEntity.adminUserName,
            dateCreated: memberBlockHistoryEntity.dateCreated,
            dateUpdated: memberBlockHistoryEntity.dateUpdated,
            id: memberBlockHistoryEntity.id,
            memberId: memberBlockHistoryEntity.memberId,
            isDeleted: memberBlockHistoryEntity.isDeleted,
            reason: memberBlockHistoryEntity.reason,
            deleteAdminUserId: memberBlockHistoryEntity.deleteAdminUserId,
            deleteAdminUserName: memberBlockHistoryEntity.deleteAdminUserName
        }

        return ret;
    }

    async getMemberBlockHistories(param: PageQuery<AdminMemberBlockListQueryParameterVM>): Promise<ListResult<AdminMemberBlockHistoryVM>> {

        const conditions: string[] = ['1 = 1'];
        const parameters: any = {};

        if (!checker.isNullOrUndefinedOrWhiteSpace(param.params.memberId)) {
            conditions.push(`m.car_plus_member_id = :memberId`);
            parameters.memberId = param.params.memberId
        }

        if (checker.isDate(param.listQueryParam.dateEnd) && checker.isDate(param.listQueryParam.dateStart)) {
            conditions.push(`o.date_created between :dateStart and :dateEnd`);
            parameters.dateStart = param.listQueryParam.dateStart
            parameters.dateEnd = param.listQueryParam.dateEnd
        } else if (checker.isDate(param.listQueryParam.dateStart)) {
            conditions.push(`o.date_created >= :dateStart`);
            parameters.dateStart = param.listQueryParam.dateStart;
        } else if (checker.isDate(param.listQueryParam.dateEnd)) {
            conditions.push(`o.date_created >= :dateEnd`);
            parameters.dateEnd = param.listQueryParam.dateEnd
        }

        const sqlWithConditions = `${baseSql} where ${conditions.join(' and ')}`

        const paginationSql = this.getPaginationSql(sqlWithConditions);
        const countSql = this.getCountSql(sqlWithConditions);

        const rowStart: number = ((param.listQueryParam.pageIndex - 1) * param.listQueryParam.pageSize) + 1;
        const rowEnd: number = rowStart + param.listQueryParam.pageSize - 1;
        parameters.rowStart = rowStart;
        parameters.rowEnd = rowEnd;

        const paginationQueryParam = this.parseSql(paginationSql, parameters)
        const countQueryParam = this.parseSql(countSql, parameters)

        const listRet: MemberBlockHistoryDbViewModel[] = await this.entityManager.query(paginationQueryParam.sql, paginationQueryParam.parameters);
        const countRet: QueryCountDbModel = await this.entityManager.query(countQueryParam.sql, countQueryParam.parameters);


        const memberBlockHistoryEntities = listRet
        const dataAmount = countRet[0].count


        const ret = new ListResult<AdminMemberBlockHistoryVM>(true)

        ret.items = memberBlockHistoryEntities.map(entity => {
            const adminMemberBlockHistoryVM: AdminMemberBlockHistoryVM = {
                adminUserId: entity.adminUserId,
                adminUserName: entity.adminUserName,
                dateCreated: entity.dateCreated,
                dateUpdated: entity.dateUpdated,
                id: entity.id,
                memberId: entity.memberId,
                isDeleted: entity.isDeleted,
                reason: entity.reason,
                deleteAdminUserId: entity.deleteAdminUserId,
                deleteAdminUserName: entity.deleteAdminUserName,
                memberNickName: entity.memberNickName,
            }
            return adminMemberBlockHistoryVM
        })

        ret.page = {
            pageAmount: Math.ceil(dataAmount / param.listQueryParam.pageSize),
            dataAmount
        }

        return ret;
    }


}