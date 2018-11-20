import { PageQuery } from './../../../view-models/common.vm';
import { MemberGamePointHistoryEntity } from '@entities/member-game-point-history.entity';
import { AdminMemberPointHistoryVM, PointType } from './../../../view-models/admin.point.vm';
import { MemberEntity } from '@entities/member.entity';
import { AdminUserToken } from '@view-models/admin.auth.vm';
import { QueryRunner, Between, MoreThan, LessThan, FindConditions } from 'typeorm';
import { BaseConnection } from '@services/base-connection';
import { Result, AppError, ListResult } from '@view-models/common.vm';
import { CreateAdminMemberPointHistoryParameterVM } from '@view-models/admin.point.vm';
import { checker } from '@utilities';
import { gameSvc } from '@services';
import { PointHistoryVM, PointHistoryType } from '@view-models/game-history.vm';
export class AdminPointLibSvc extends BaseConnection {

    private adminUserToken: AdminUserToken = null

    constructor(adminUserToken: AdminUserToken, queryRunner: QueryRunner) {
        super(queryRunner)
        this.adminUserToken = adminUserToken
    }



    async getManualGamePointHistory(param: PageQuery): Promise<ListResult<AdminMemberPointHistoryVM>> {
        const memberGamePointHistoryRepository = await this.entityManager.getRepository(MemberGamePointHistoryEntity)

        const skip = (param.listQueryParam.pageIndex - 1) * param.listQueryParam.pageSize
        const take = param.listQueryParam.pageSize
        const conditions: FindConditions<MemberGamePointHistoryEntity> = {};
        if (checker.isDate(param.listQueryParam.dateEnd) && checker.isDate(param.listQueryParam.dateStart)) {
            conditions.dateCreated = Between<Date>(param.listQueryParam.dateStart, param.listQueryParam.dateEnd)
        } else if (checker.isDate(param.listQueryParam.dateStart)) {
            conditions.dateCreated = MoreThan(param.listQueryParam.dateStart)
        } else if (checker.isDate(param.listQueryParam.dateEnd)) {
            conditions.dateCreated = LessThan(param.listQueryParam.dateEnd)
        }

        const findAndCountRet = await memberGamePointHistoryRepository.findAndCount({
            order: {
                dateCreated: "DESC"
            },
            join: {
                alias: 'memberGamePointHistory',
                leftJoinAndSelect: {
                    gameItem: "memberGamePointHistory.gameItem"
                },
                innerJoinAndSelect: {
                    member: "memberGamePointHistory.member"
                }
            },
            where: {
                type: PointHistoryType.manual
            },
            skip,
            take
        })
        const memberGamePointHistoryEntities = findAndCountRet[0]
        const dataAmount = findAndCountRet[1]

        const ret = new ListResult<AdminMemberPointHistoryVM>(true);
        ret.items = memberGamePointHistoryEntities.map(entity => this.parseAdminMemberPointHistoryVMFromPointHistoryVM(entity))

        ret.page = {
            pageAmount: Math.ceil(dataAmount / param.listQueryParam.pageSize),
            dataAmount
        }


        return ret;
    }


    async addPoint(param: CreateAdminMemberPointHistoryParameterVM): Promise<Result<AdminMemberPointHistoryVM>> {



        const { memberId, gamePoint, adminUserName, reason } = param;

        if (checker.isNullOrUndefinedObject(memberId)) {
            throw new AppError('請選擇會員')
        }

        if (!checker.isNaturalInteger(gamePoint)) {
            throw new AppError('金額請輸入大於 0 的數字')
        }

        if (checker.isNullOrUndefinedOrWhiteSpace(adminUserName)) {
            throw new AppError('請輸入經手人')
        }

        if (checker.isNullOrUndefinedOrWhiteSpace(reason)) {
            throw new AppError('請輸入原因')
        }

        const memberRepository = this.entityManager.getRepository(MemberEntity)

        const memberEntity = await memberRepository.findOne(memberId);

        if (checker.isNullOrUndefinedObject(memberEntity)) {
            throw new AppError('查無此會員')
        }

        const memberAddPointRet = await gameSvc.memberAddPointByManual(this.adminUserToken.payload.id, {
            adminUserName,
            memberId,
            gamePoint,
            reason
        }, this.queryRunner);

        const ret = new Result<AdminMemberPointHistoryVM>(true);

        const memberGamePointHistoryRepository = await this.entityManager.getRepository(MemberGamePointHistoryEntity)

        const memberGamePointHistoryEntity = await memberGamePointHistoryRepository.findOne({
            join: {
                alias: 'memberGamePointHistory',
                leftJoinAndSelect: {
                    gameItem: "memberGamePointHistory.gameItem"
                },
                innerJoinAndSelect: {
                    member: "memberGamePointHistory.member"
                }
            },
            where: {
                id: memberAddPointRet.item.id
            }
        })

        ret.item = this.parseAdminMemberPointHistoryVMFromPointHistoryVM(memberGamePointHistoryEntity)


        return ret;
    }

    private parseAdminMemberPointHistoryVMFromPointHistoryVM(param: MemberGamePointHistoryEntity): AdminMemberPointHistoryVM {

        const {
            id,
            memberId,
            gameItemId,
            beforeGamePoint,
            changeGamePoint,
            afterGamePoint,
            beforeCarPlusPoint,
            afterCarPlusPoint,
            changeCarPlusPoint,
            adminUserId,
            adminUserName,
            member,
            gameItem,

        } = param

        const ret: AdminMemberPointHistoryVM = {
            id,
            gameItemId,
            memberId,
            pointType: null,
            beforeGamePoint,
            changePoint: changeGamePoint,
            afterGamePoint,
            beforeCarPlusPoint,
            afterCarPlusPoint,
            changeCarPlusPoint,
            adminUserId,
            adminUserName,
            member: {
                id: member.id,
                nickName: member.nickName,
                carPlusPoint: member.carPlusPoint,
                gamePoint: member.gamePoint,
                level: member.level,
                experience: member.experience,
                carPlusMemberId: member.carPlusMemberId
            },
            gameItem: null
        }

        if (gameItem) {
            ret.gameItem = {
                id: gameItem.id,
                description: gameItem.description,
                name: gameItem.name,
                imageUrl: gameItem.imageUrl,
                gamePoint: gameItem.gamePoint,
                carPlusPoint: gameItem.carPlusPoint,
                type: gameItem.type,
                enableBuy: true
            }
        }


        const gamePointTypes = [
            PointHistoryType.game,
            PointHistoryType.manual,
            PointHistoryType.gamePointTransferToGameItem,
            PointHistoryType.gamePointTransferToCarPlusPoint,
            PointHistoryType.memberInit
        ]

        ret.pointType = gamePointTypes.some(type => type === param.type) ? PointType.gamePoint : PointType.carPlus;

        return ret;
    }

}