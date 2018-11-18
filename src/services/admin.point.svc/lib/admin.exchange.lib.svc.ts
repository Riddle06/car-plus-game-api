import { MemberGameItemOrderEntity } from './../../../entities/member-game-item-order.entity';
import { BaseConnection } from '@services/base-connection';
import { ListResult, PageQuery } from '@view-models/common.vm';
import { AdminMemberGameItemOrderVM, AdminMemberGameItemQueryParameterVM } from '@view-models/admin.point.vm';
import { FindConditions, Between, MoreThan, LessThan } from 'typeorm';
import { checker } from '@utilities';
import { PointHistoryType } from '@view-models/game-history.vm';
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

        const memberGameItemOrderEntities = await memberGameItemOrderRepository.find({
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


        return ret;
    }
}