import { QueryCountDbModel } from './../../../view-models/common.vm';
import { MemberGameItemOrderEntity } from './../../../entities/member-game-item-order.entity';
import { BaseConnection } from '@services/base-connection';
import { ListResult, PageQuery } from '@view-models/common.vm';
import { AdminMemberGameItemOrderVM, AdminMemberGameItemQueryParameterVM, PointType } from '@view-models/admin.point.vm';
import { FindConditions, Between, MoreThan, LessThan } from 'typeorm';
import { checker } from '@utilities';
import { PointHistoryType } from '@view-models/game-history.vm';
import { ExportResult, exporter } from '@utilities/exporter';

const baseSql = `
select o.id as id,
o.game_item_id as gameItemId,
o.point_type as pointType,
o.point_amount as pointAmount,
o.game_item_count as gameItemCount,
o.member_id as memberId,
m.nick_name  as memberNickName,
m.car_plus_point as memberCarPlusPoint,
m.car_plus_member_id as memberCarPlusMemberId,
gi.name  as gameItemName,
gi.type  as gameItemType,
o.date_created as dateCreated,
ROW_NUMBER () OVER ( order by o.date_created desc) as row
from  member_game_item_order as o
join member as m on m.id=  o.member_id
join game_item as gi on gi.id = o.game_item_id`

type MemberGameItemOrderViewDbModel = {
    id: string
    gameItemId: string
    pointType: number
    pointAmount: number
    gameItemCount: number
    memberId: string
    memberNickName: string
    memberCarPlusPoint: number
    memberCarPlusMemberId: number
    gameItemName: string
    gameItemType: number
    dateCreated: Date
}

type ExportExchangeOrderItem = {
    memberId: string
    gameItemName: string
    pointTypeName: string
    pointAmount: number
    gameItemCount: number
    dateCreated: Date
}

export class AdminExchangeLibSvc extends BaseConnection {
    async getExchangeOrders(param: PageQuery<AdminMemberGameItemQueryParameterVM>): Promise<ListResult<AdminMemberGameItemOrderVM>> {

        const conditions: string[] = ['1 = 1'];
        const parameters: any = {};

        if (!checker.isNullOrUndefinedOrWhiteSpace(param.params.memberId)) {
            conditions.push(`m.id = :memberId`);
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

        const listRet: MemberGameItemOrderViewDbModel[] = await this.entityManager.query(paginationQueryParam.sql, paginationQueryParam.parameters);
        const countRet: QueryCountDbModel = await this.entityManager.query(countQueryParam.sql, countQueryParam.parameters);


        const memberGameItemOrderEntities = listRet
        const dataAmount = countRet[0].count

        const ret = new ListResult<AdminMemberGameItemOrderVM>(true);

        ret.items = memberGameItemOrderEntities.map(entity => {
            const item: AdminMemberGameItemOrderVM = {
                id: entity.id,
                pointType: entity.pointType,
                pointAmount: entity.pointAmount,
                gameItemCount: entity.gameItemCount,
                dateCreated: entity.dateCreated,
                member: {
                    id: entity.memberId,
                    nickName: entity.memberNickName
                },
                gameItem: {
                    id: entity.gameItemId,
                    name: entity.gameItemName
                }
            }
            return item
        })

        ret.page = {
            pageAmount: Math.ceil(dataAmount / param.listQueryParam.pageSize),
            dataAmount
        }


        return ret;
    }

    async exportExchangeOrders(param: PageQuery<AdminMemberGameItemQueryParameterVM>): Promise<ExportResult> {
        const conditions: FindConditions<MemberGameItemOrderEntity> = {};

        if (!checker.isNullOrUndefinedOrWhiteSpace(param.params.memberId)) {
            conditions.memberId = param.params.memberId
        }

        if (checker.isDate(param.listQueryParam.dateEnd) && checker.isDate(param.listQueryParam.dateStart)) {
            conditions.dateCreated = Between<Date>(param.listQueryParam.dateStart, param.listQueryParam.dateEnd)
        } else if (checker.isDate(param.listQueryParam.dateStart)) {
            conditions.dateCreated = MoreThan(param.listQueryParam.dateStart)
        } else if (checker.isDate(param.listQueryParam.dateEnd)) {
            conditions.dateCreated = LessThan(param.listQueryParam.dateEnd)
        }


        const memberGameItemOrderRepository = await this.entityManager.getRepository(MemberGameItemOrderEntity)

        const findAndCountRet = await memberGameItemOrderRepository.findAndCount({
            relations: ['member', 'gameItem'],
            where: {
                ...conditions
            },
            order: {
                dateCreated: 'DESC'
            }
        })

        const memberGameItemOrderEntities = findAndCountRet[0]

        const data = memberGameItemOrderEntities.map(entity => {
            const { member, gameItem, pointAmount, pointType, dateCreated, gameItemCount } = entity
            let pointTypeName = '';
            switch (pointType) {
                case PointType.carPlus:
                    pointTypeName = '格上紅利'
                    break;
                case PointType.gamePoint:
                    pointTypeName = '超人幣'
                    break;
            }

            const item: ExportExchangeOrderItem = {
                memberId: member.carPlusMemberId,
                gameItemName: gameItem.name,
                pointTypeName,
                pointAmount,
                gameItemCount,
                dateCreated,
            }
            return item
        })


        return exporter.exportByFieldDicAndData({
            data,
            fieldNameDic: {
                memberId: "ID",
                gameItemName: "購買道具及角色",
                pointTypeName: "花費單位",
                pointAmount: "總金額",
                gameItemCount: "數量",
                dateCreated: "兌換時間",
            },
            sheetName: "sheet1",
            fileName: "紅利兌換查詢"
        });
    }
}