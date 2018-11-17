import { MemberBlockHistoryEntity } from './../../../entities/member-block-history.entity';
import { MemberEntity } from './../../../entities/member.entity';
import { AppError } from './../../../view-models/common.vm';
import { QueryRunner, FindConditions } from 'typeorm';
import { BaseConnection } from '@services/base-connection';
import { AdminMemberBlockParameter, AdminMemberBlockHistoryVM, AdminMemberBlockListQueryParameterVM } from '@view-models/admin.member.vm';
import { ListResult, PageQuery, Result } from '@view-models/common.vm';
import { AdminUserToken } from '@view-models/admin.auth.vm';
import { checker, uniqueId } from '@utilities';
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
        memberEntity.dateUpdated = new Date()
        memberEntity.isBlock = true;
        await memberEntity.save();

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

        const memberBlockHistoryRepository = this.entityManager.getRepository(MemberBlockHistoryEntity)

        const conditions: FindConditions<MemberBlockHistoryEntity> = {};

        if (!checker.isNullOrUndefinedOrWhiteSpace(param.params.memberId)) {
            conditions.memberId = param.params.memberId
        }

        const skip = (param.listQueryParam.pageIndex - 1) * param.listQueryParam.pageSize
        const take = param.listQueryParam.pageSize

        const memberBlockHistoryEntities = await memberBlockHistoryRepository.find({
            relations: ['member'],
            where: {
                isDeleted: false,
                ...conditions
            },
            order: {
                dateCreated: 'DESC'
            },
            skip,
            take
        })
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
                memberNickName: entity.member.nickName
            }
            return adminMemberBlockHistoryVM
        })
        return ret;
    }


}