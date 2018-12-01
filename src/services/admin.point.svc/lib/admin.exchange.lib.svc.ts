import { MemberGameItemOrderEntity } from './../../../entities/member-game-item-order.entity';
import { BaseConnection } from '@services/base-connection';
import { ListResult, PageQuery } from '@view-models/common.vm';
import { AdminMemberGameItemOrderVM, AdminMemberGameItemQueryParameterVM, PointType } from '@view-models/admin.point.vm';
import { FindConditions, Between, MoreThan, LessThan } from 'typeorm';
import { checker } from '@utilities';
import { PointHistoryType } from '@view-models/game-history.vm';
import { ExportResult, exporter } from '@utilities/exporter';

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

        const skip = (param.listQueryParam.pageIndex - 1) * param.listQueryParam.pageSize
        const take = param.listQueryParam.pageSize

        const memberGameItemOrderRepository = await this.entityManager.getRepository(MemberGameItemOrderEntity)

        const findAndCountRet = await memberGameItemOrderRepository.findAndCount({
            relations: ['member', 'gameItem'],
            where: {
                ...conditions
            },
            order: {
                dateCreated: 'DESC'
            },
            skip,
            take
        })

        const memberGameItemOrderEntities = findAndCountRet[0]
        const dataAmount = findAndCountRet[1]

        const ret = new ListResult<AdminMemberGameItemOrderVM>(true);

        ret.items = memberGameItemOrderEntities.map(entity => {
            const item: AdminMemberGameItemOrderVM = {
                id: entity.id,
                memberId: entity.memberId,
                gameItemId: entity.gameItemId,
                pointType: entity.pointType,
                pointAmount: entity.pointAmount,
                gameItemCount: entity.gameItemCount,
                dateCreated: entity.dateCreated,
                member: {
                    id: entity.member.id,
                    nickName: entity.member.nickName,
                    carPlusPoint: entity.member.carPlusPoint,
                    gamePoint: entity.member.gamePoint,
                    level: entity.member.level,
                    experience: entity.member.experience,
                    carPlusMemberId: entity.member.carPlusMemberId,
                },
                gameItem: {
                    id: entity.gameItem.id,
                    description: entity.gameItem.description,
                    name: entity.gameItem.name,
                    imageUrl: entity.gameItem.imageUrl,
                    gamePoint: entity.gameItem.gamePoint,
                    carPlusPoint: entity.gameItem.carPlusPoint,
                    type: entity.gameItem.type,
                    enableBuy: entity.gameItem.enabled
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