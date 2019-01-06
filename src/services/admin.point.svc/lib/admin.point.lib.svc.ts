import { MemberGamePointHistoryEntity } from '@entities/member-game-point-history.entity';
import { AdminMemberPointHistoryVM, PointType, AdminMemberGameItemQueryParameterVM } from './../../../view-models/admin.point.vm';
import { MemberEntity } from '@entities/member.entity';
import { AdminUserToken } from '@view-models/admin.auth.vm';
import { QueryRunner } from 'typeorm';
import { BaseConnection } from '@services/base-connection';
import { Result, AppError, ListResult, PageQuery, QueryCountDbModel } from '@view-models/common.vm';
import { CreateAdminMemberPointHistoryParameterVM } from '@view-models/admin.point.vm';
import { checker } from '@utilities';
import { gameSvc } from '@services';
import { PointHistoryVM, PointHistoryType } from '@view-models/game-history.vm';


const baseSql = `
select 
history.id as id,
history.member_id as memberId,
history.game_item_id as gameItemId,
m.nick_name as memberNickName,
m.car_plus_member_id as carPlusMemberId,
m.short_id as memberShortId,
gi.name as gameItemName,
history.type as historyType,
history.before_game_point as beforeGamePoint,
history.change_game_point as changeGamePoint,
history.after_game_point as afterGamePoint,
history.before_car_plus_point as beforeCarPlusPoint,
history.change_car_plus_point as changeCarPlusPoint,
history.after_car_plus_point as afterCarPlusPoint,
history.admin_user_name as adminUserName,
history.admin_user_id as adminUserId,
history.description as description,
history.date_created as dateCreated,
ROW_NUMBER () OVER ( order by history.date_created desc) as row
from member_game_point_history history
join member as m on m.id = history.member_id
left join game_item as gi on gi.id = history.game_item_id
`

type MemberGamePointHistoryViewDbModel = {
    id: string
    memberId: string
    memberShortId: string
    gameItemId: string
    memberNickName: string
    carPlusMemberId: string
    gameItemName: string
    historyType: number
    beforeGamePoint: number
    changeGamePoint: number
    afterGamePoint: number
    beforeCarPlusPoint: number
    changeCarPlusPoint: number
    afterCarPlusPoint: number
    adminUserName: string
    adminUserId: string
    description: string
    dateCreated: Date
    row: number
}

export class AdminPointLibSvc extends BaseConnection {

    private adminUserToken: AdminUserToken = null

    constructor(adminUserToken: AdminUserToken, queryRunner: QueryRunner) {
        super(queryRunner)
        this.adminUserToken = adminUserToken
    }



    async getManualGamePointHistory(param: PageQuery<AdminMemberGameItemQueryParameterVM>): Promise<ListResult<AdminMemberPointHistoryVM>> {


        const conditions: string[] = ['1=1', `history.type in(:type)`];
        const parameters: any = {
            type: [PointHistoryType.manual]
        };


        if (!checker.isNullOrUndefinedOrWhiteSpace(param.params.memberId)) {
            conditions.push(`m.car_plus_member_id = :memberId`);
            parameters.memberId = param.params.memberId
        }

        if (!checker.isNullOrUndefinedOrWhiteSpace(param.params.shortId)) {
            conditions.push(`m.short_id = :shortId`);
            parameters.shortId = param.params.shortId
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

        const listRet: MemberGamePointHistoryViewDbModel[] = await this.entityManager.query(paginationQueryParam.sql, paginationQueryParam.parameters);
        const countRet: QueryCountDbModel = await this.entityManager.query(countQueryParam.sql, countQueryParam.parameters);


        const memberGamePointHistoryEntities = listRet
        const dataAmount = countRet[0].count

        const ret = new ListResult<AdminMemberPointHistoryVM>(true);
        ret.items = memberGamePointHistoryEntities.map(entity => this.parseAdminMemberPointHistoryVMFromMemberGamePointHistoryViewDbModel(entity))

        ret.page = {
            pageAmount: Math.ceil(dataAmount / param.listQueryParam.pageSize),
            dataAmount
        }


        return ret;
    }


    async addPoint(param: CreateAdminMemberPointHistoryParameterVM): Promise<Result<AdminMemberPointHistoryVM>> {

        const { shortId, gamePoint, adminUserName, reason } = param;

        if (checker.isNullOrUndefinedObject(shortId)) {
            throw new AppError('請輸入遊戲ID')
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

        const memberEntity = await memberRepository.findOne({
            where: {
                shortId
            }
        });

        if (checker.isNullOrUndefinedObject(memberEntity)) {
            throw new AppError('查無此會員')
        }

        const memberAddPointRet = await gameSvc.memberAddPointByManual(this.adminUserToken.payload.id, {
            adminUserName,
            memberId: memberEntity.id,
            carPlusMemberId: memberEntity.carPlusMemberId,
            shortId: shortId,
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
            dateCreated,
            description
        } = param

        const ret: AdminMemberPointHistoryVM = {
            id,
            gameItemId,
            memberId,
            pointType: null,
            beforeGamePoint,
            changeGamePoint,
            afterGamePoint,
            beforeCarPlusPoint,
            afterCarPlusPoint,
            changeCarPlusPoint,
            adminUserId,
            adminUserName,
            member: {
                id: member.id,
                nickName: member.nickName,
                carPlusMemberId: member.carPlusMemberId,
                shortId: member.shortId
            },
            gameItem: null,
            dateCreated,
            description
        }

        if (gameItem) {
            ret.gameItem = {
                id: gameItem.id,
                name: gameItem.name,
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

    private parseAdminMemberPointHistoryVMFromMemberGamePointHistoryViewDbModel(param: MemberGamePointHistoryViewDbModel): AdminMemberPointHistoryVM {

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
            memberNickName,
            gameItemName,
            dateCreated,
            carPlusMemberId,
            memberShortId,
            description
        } = param

        const ret: AdminMemberPointHistoryVM = {
            id,
            gameItemId,
            memberId,
            pointType: null,
            beforeGamePoint,
            changeGamePoint: changeGamePoint,
            afterGamePoint,
            beforeCarPlusPoint,
            afterCarPlusPoint,
            changeCarPlusPoint,
            adminUserId,
            adminUserName,
            member: {
                id: memberId,
                nickName: memberNickName,
                carPlusMemberId,
                shortId: memberShortId
            },
            gameItem: gameItemId ? {
                id: gameItemId,
                name: gameItemName,
            } : null,
            dateCreated,
            description
        }

        const gamePointTypes = [
            PointHistoryType.game,
            PointHistoryType.manual,
            PointHistoryType.gamePointTransferToGameItem,
            PointHistoryType.gamePointTransferToCarPlusPoint,
            PointHistoryType.memberInit
        ]

        ret.pointType = gamePointTypes.some(type => type === param.historyType) ? PointType.gamePoint : PointType.carPlus;

        return ret;
    }

}