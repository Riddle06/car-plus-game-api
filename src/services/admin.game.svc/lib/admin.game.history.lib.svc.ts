import { GameCode } from './../../../view-models/game.vm';
import { MemberGameHistoryEntity } from '@entities/member-game-history.entity';
import { BaseConnection } from '@services/base-connection';
import { PageQuery, ListResult } from '@view-models/common.vm';
import { AdminMemberGameHistoryParameterVM, AdminMemberGameHistoryVM } from '@view-models/admin.game.vm';
import { FindConditions, Between, MoreThan, LessThan, IsNull, Not } from 'typeorm';
import { MemberBlockHistoryEntity } from '@entities/member-block-history.entity';
import { checker } from '@utilities';
import { ExportResult, exporter } from '@utilities/exporter';

type ExportGameHistoryItem = {
    id: string
    gameName: string
    dateCreated: Date
    gameScore: number
    gamePoint: number
}
export class AdminGameHistoryLibSvc extends BaseConnection {

    async getGameHistory(param: PageQuery<AdminMemberGameHistoryParameterVM>): Promise<ListResult<AdminMemberGameHistoryVM>> {

        const memberGameHistoryRepository = this.entityManager.getRepository(MemberGameHistoryEntity);

        const conditions: FindConditions<MemberGameHistoryEntity> = {
            dateFinished: Not(IsNull())
        };

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

        const findAndCountRet = await memberGameHistoryRepository.findAndCount({
            relations: ['member', 'game'],
            where: {
                ...conditions
            },
            order: {
                dateCreated: 'DESC'
            },
            skip,
            take

        })

        const memberGameHistoryEntities = findAndCountRet[0]
        const dataAmount = findAndCountRet[1]
        const ret = new ListResult<AdminMemberGameHistoryVM>();

        ret.items = memberGameHistoryEntities.map(entity => {
            const { id, memberId, dateCreated, gameScore, gamePoint, dateFinished } = entity
            const item: AdminMemberGameHistoryVM = {
                id,
                memberId,
                dateCreated,
                score: gameScore,
                point: gamePoint,
                isFinish: !checker.isNullOrUndefinedObject(dateFinished),
                dateFinished,
                game: {
                    id: entity.game.id,
                    name: entity.game.name,
                    description: entity.game.description,
                    imageUrl: entity.game.gameCoverImageUrl,
                    parameters: entity.game.parameters,
                    code: entity.game.code as GameCode,
                },
                member: {
                    id: entity.member.id,
                    nickName: entity.member.nickName,
                    carPlusPoint: entity.member.carPlusPoint,
                    gamePoint: entity.member.gamePoint,
                    level: entity.member.level,
                    experience: entity.member.experience,
                    carPlusMemberId: entity.member.carPlusMemberId,
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

    async exportGameHistory(param: PageQuery<AdminMemberGameHistoryParameterVM>): Promise<ExportResult> {
        const memberGameHistoryRepository = this.entityManager.getRepository(MemberGameHistoryEntity);

        const conditions: FindConditions<MemberGameHistoryEntity> = {
            dateFinished: Not(IsNull())
        };

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

        const findAndCountRet = await memberGameHistoryRepository.findAndCount({
            relations: ['member', 'game'],
            where: {
                ...conditions
            },
            order: {
                dateCreated: 'DESC'
            }
        })

        const memberGameHistoryEntities = findAndCountRet[0]


        const items = memberGameHistoryEntities.map(entity => {
            const { id, memberId, dateCreated, gameScore, gamePoint, dateFinished } = entity

            const item: ExportGameHistoryItem = {
                id: entity.member.carPlusMemberId,
                dateCreated: dateCreated,
                gameName: entity.game.name,
                gameScore,
                gamePoint
            }

            return item
        })

        const ret = exporter.exportByFieldDicAndData({
            data: items,
            fieldNameDic: {
                id: "ID",
                gameName: "遊戲項目",
                dateCreated: "發生時間",
                gameScore: "該場分數",
                gamePoint: "該場超人幣"
            },
            fileName: "遊戲紀錄",
            sheetName: "sheet1"
        })
        return ret;
    }

}