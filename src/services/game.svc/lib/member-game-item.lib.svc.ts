import { MemberBuyGameItemParameter } from '@view-models/game.vm';
import { BaseConnection } from '../../base-connection';
import { QueryRunner, MoreThan } from 'typeorm';
import { MemberGameItemEntity } from '@entities/member-game-item.entity';
import { GameItemType, MemberGameItemVM } from '../../../view-models/game.vm';
import { checker, uniqueId } from '@utilities';
import { AppError, BaseResult, ListResult } from '@view-models/common.vm';
import { GameItemEntity } from '@entities/game-item.entity';
import { MemberEntity } from '@entities/member.entity';
import { memberSvc } from '@services/member.svc';
import { variableSvc } from '@services/variable.svc';
import { carPlusSvc } from '@services/car-plus.svc';
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

        const gameItemEntity = await this.entityManager.getRepository(GameItemEntity).findOne(gameItemId);

        // 商品是否存在
        if (checker.isNullOrUndefinedObject(gameItemEntity)) {
            throw new AppError('查無此商品')
        }

        if (!checker.isNaturalInteger(num)) {
            throw new AppError('數量參數錯誤')
        }

        if (!gameItemEntity.enabled) {
            throw new AppError('此商品尚未開放')
        }

        const memberInformationRet = await memberSvc.getMemberInformationByMemberId(this.memberId, this.queryRunner)

        const { level, carPlusPoint, carPlusMemberId, gamePoint } = memberInformationRet.item;


        // 除了超人幣是用格上紅利買，其他都是用
        // 等級驗證
        if (gameItemEntity.levelMinLimit > -1 && level < gameItemEntity.levelMinLimit) {
            throw new AppError('等級不足，無法購買此道具')
        }

        // 金額驗證
        if ((gameItemEntity.gamePoint * param.num) > gamePoint) {
            throw new AppError('超人幣不足，無法扣買')
        }

        // 新增一筆紀錄
        const memberGameItemEntities: MemberGameItemEntity[] = [];
        for (let i = 0; i < num; i++) {
            memberGameItemEntities.push(await this.addMemberGameItem(gameItemId))
        }

        await this.entityManager.getRepository(MemberGameItemEntity).insert(memberGameItemEntities);

        return null;
    }

    private async addMemberGameItem(gameItemId: string): Promise<MemberGameItemEntity> {

        const memberGameItemEntity = new MemberGameItemEntity();
        memberGameItemEntity.id = uniqueId.generateV4UUID();
        memberGameItemEntity.gameItemId = gameItemId
        memberGameItemEntity.memberId = this.memberId
        memberGameItemEntity.memberGamePointHistoryId = null;

        memberGameItemEntity.dateCreated = new Date();
        memberGameItemEntity.dateUpdated = new Date();
        memberGameItemEntity.enabled = true;
        memberGameItemEntity.totalUsedTimes = 
        memberGameItemEntity.remainTimes
        memberGameItemEntity.dateLastUsed
        memberGameItemEntity.isUsing


        // switch (gameItemEntity.type) {
        //     case GameItemType.tool:

        //         // 扣遊戲點數

        //         break;
        //     case GameItemType.role:

        //         // 扣遊戲點數
        //         break;
        //     case GameItemType.carPlusPoint:
        //         // 只能買一個

        //         // 扣遊戲點數

        //         // 要加紅利
        //         break;
        //     case GameItemType.gamePoint:

        //         // 要扣掉格上紅利
        //         // 加遊戲點數
        //         break;
        // }



        return null;
    }

}