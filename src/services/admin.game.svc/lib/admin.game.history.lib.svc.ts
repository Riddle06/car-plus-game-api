import { GameCode } from './../../../view-models/game.vm';
import { MemberGameHistoryEntity } from '@entities/member-game-history.entity';
import { BaseConnection } from '@services/base-connection';
import { PageQuery, ListResult } from '@view-models/common.vm';
import { AdminMemberGameHistoryParameterVM, AdminMemberGameHistoryVM } from '@view-models/admin.game.vm';
import { FindConditions } from 'typeorm';
import { MemberBlockHistoryEntity } from '@entities/member-block-history.entity';
import { checker } from '@utilities';
export class AdminGameHistoryLibSvc extends BaseConnection {

    async getGameHistory(param: PageQuery<AdminMemberGameHistoryParameterVM>): Promise<ListResult<AdminMemberGameHistoryVM>> {

        const memberGameHistoryRepository = this.entityManager.getRepository(MemberGameHistoryEntity);

        const conditions: FindConditions<MemberBlockHistoryEntity> = {};

        if (!checker.isNullOrUndefinedOrWhiteSpace(param.params.memberId)) {
            conditions.memberId = param.params.memberId
        }

        const skip = (param.listQueryParam.pageIndex - 1) * param.listQueryParam.pageSize
        const take = param.listQueryParam.pageSize

        const memberGameHistoryEntities = await memberGameHistoryRepository.find({
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
        return ret;
    }

}