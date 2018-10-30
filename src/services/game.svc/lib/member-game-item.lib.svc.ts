import { MemberBuyGameItemParameter } from '@view-models/game.vm';
import { BaseConnection } from '../../base-connection';
import { QueryRunner, MoreThan } from 'typeorm';
import { MemberGameItemEntity } from '@entities/member-game-item.entity';
import { GameItemType, MemberGameItemVM } from '../../../view-models/game.vm';
import { checker } from '@utilities';
import { AppError, BaseResult, ListResult } from '@view-models/common.vm';
export class MemberGameItemLibSvc extends BaseConnection {

    private memberId: string = null

    constructor(memberId: string, queryRunner: QueryRunner) {
        super(queryRunner);
        this.memberId = memberId;
    }

    async getMemberGameItems(): Promise<ListResult<MemberGameItemVM>> {
        const memberGameItemRepository = await this.entityManager.getRepository(MemberGameItemEntity);

        const memberGameItemEntities = await memberGameItemRepository.find({
            relations: ['gameItem'],
            where: {
                memberId: this.memberId,
                remainTimes: MoreThan(0),
                enabled: true
            }
        })

        const ret = new ListResult<MemberGameItemVM>(true);

        ret.items = memberGameItemEntities.map(memberGameItem => {
            const item: MemberGameItemVM = {
                haveItem: true,
                haveItemCount: 1,
                dateCreated: memberGameItem.dateCreated,
                id: memberGameItem.id,
                imageUrl: memberGameItem.gameItem.imageUrl,
                gamePoint: memberGameItem.gameItem.gamePoint,
                type: memberGameItem.gameItem.type,
                carPlusPoint: memberGameItem.gameItem.gamePoint,
                description: memberGameItem.gameItem.description,
                enableBuy: false,
                name: memberGameItem.gameItem.name
            }
            return item
        })


        return ret;
    }

    async useGameItem(memberGameItemId: string): Promise<BaseResult> {

        const memberGameItemRepository = await this.entityManager.getRepository(MemberGameItemEntity);

        const useMemberGameItem = await memberGameItemRepository.findOne({
            relations: ['gameItem'],
            where: {
                id: memberGameItemId,
                memberId: this.memberId
            }
        });

        if (checker.isNullOrUndefinedObject(useMemberGameItem)) {
            throw new AppError(`查無此道具可使用`);
        }

        if (checker.isNullOrUndefinedObject(useMemberGameItem.gameItem)) {
            throw new AppError(`查無此道具可使用`);
        }

        const memberGameItems = await memberGameItemRepository.find({
            relations: ['gameItem'],
            where: {
                isUsing: true,
                memberId: this.memberId
            }
        });

        const updateUseMemberGameItemDic: Partial<MemberGameItemEntity> = {
            isUsing: true
        }

        switch (useMemberGameItem.gameItem.type) {


            case GameItemType.tool:

                // 判斷目前是否有正在使用的道具
                if (useMemberGameItem.gameItem.enabledAddGamePointRate) {
                    if (memberGameItems.find(memberGameItem =>
                        memberGameItem.gameItem.type === GameItemType.tool && memberGameItem.gameItem.enabledAddGamePointRate)) {
                        throw new AppError(`目前已有同性質的道具正在使用中，使用完後才能選擇此道具`);
                    }
                }


                if (useMemberGameItem.gameItem.enabledAddScoreRate) {
                    if (memberGameItems.find(memberGameItem =>
                        memberGameItem.gameItem.type === GameItemType.tool && memberGameItem.gameItem.enabledAddScoreRate)) {
                        throw new AppError(`目前已有同性質的道具正在使用中，使用完後才能選擇此道具`);
                    }
                }


                break;
            case GameItemType.role:
                // 若目前有正在使用的角色，把目前用的角色設定成沒在使用
                const currentRoleMemberGameItem = memberGameItems.find(memberGameItem => memberGameItem.gameItem.type === GameItemType.role)
                if (!checker.isNullOrUndefinedObject(currentRoleMemberGameItem)) {
                    await memberGameItemRepository.update({ id: currentRoleMemberGameItem.id }, {
                        isUsing: false
                    })
                }
                currentRoleMemberGameItem.dateLastUsed = new Date();
                break;
        }

        await this.entityManager.getRepository(MemberGameItemEntity).update({
            id: memberGameItemId
        }, updateUseMemberGameItemDic);


        return new BaseResult(true);
    }

    async memberBuyGameItem(param: MemberBuyGameItemParameter): Promise<BaseResult> {
        const { gameItemId, num } = param;

        // 商品是否存在

        // 數量是否正確

        // 計算金額是否正確



        return null;
    }

}