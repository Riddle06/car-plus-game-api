import { MemberGameItemOrderEntity } from './../../../entities/member-game-item-order.entity';
import { MemberBuyGameItemParameter, UseGameItemVM, GameItemVM } from '@view-models/game.vm';
import { BaseConnection } from '../../base-connection';
import { QueryRunner, MoreThan, Between } from 'typeorm';
import { MemberGameItemEntity } from '@entities/member-game-item.entity';
import { GameItemType, MemberGameItemVM } from '../../../view-models/game.vm';
import { checker, uniqueId } from '@utilities';
import { AppError, BaseResult, ListResult, Result } from '@view-models/common.vm';
import { GameItemEntity } from '@entities/game-item.entity';
import { MemberEntity } from '@entities/member.entity';
import { memberSvc } from '@services/member.svc';
import { variableSvc } from '@services/variable.svc';
import { carPlusSvc } from '@services/car-plus.svc';
import { MemberGamePointLibSvc } from './member-game-point.lib.svc';
import { PointHistoryVM } from '@view-models/game-history.vm';
import * as luxon from "luxon";
import { PointType } from '@view-models/admin.point.vm';
import * as _ from "lodash";
export class MemberGameItemLibSvc extends BaseConnection {

    private memberId: string = null

    constructor(memberId: string, queryRunner: QueryRunner) {
        super(queryRunner);
        this.memberId = memberId;
    }

    // 使用者的 "道具" 列表
    async getMemberUsableGameItems(): Promise<ListResult<UseGameItemVM>> {

        const gameItemRepository = await this.entityManager.getRepository(GameItemEntity);

        const gameItemEntities = await gameItemRepository.find({
            where: {
                type: GameItemType.tool,
                enabled: true
            }
        })

        const ret = new ListResult<UseGameItemVM>(true)

        const useGameItems = gameItemEntities.map(entity => {

            const { id, description, name, imageUrl, gamePoint, carPlusPoint, type } = entity
            const gameItem: GameItemVM = {
                id,
                description,
                name,
                imageUrl,
                gamePoint,
                carPlusPoint,
                type,
                enableBuy: true
            }

            const useGameItem: UseGameItemVM = {
                gameItemId: entity.id,
                isUsing: false,
                usingRemainTimes: 0,
                totalGameItemCount: 0,
                type: entity.type,
                memberGameItemIds: [],
                gameItem
            }
            return useGameItem
        })

        ret.items = useGameItems;


        const memberGameItemRepository = await this.entityManager.getRepository(MemberGameItemEntity);

        const memberGameItemEntities = await memberGameItemRepository.find({
            relations: ['gameItem'],
            where: {
                memberId: this.memberId,
                remainTimes: MoreThan(0),
                enabled: true
            }
        });


        for (const useGameItem of useGameItems) {

            useGameItem.memberGameItemIds = memberGameItemEntities.filter(entity => entity.gameItemId === useGameItem.gameItemId).map(entity => entity.id);
            useGameItem.totalGameItemCount = useGameItem.memberGameItemIds.length;

            // 正在使用
            const usingMemberGameItem = memberGameItemEntities.find(entity => entity.gameItem.type === GameItemType.tool && entity.gameItem.id === useGameItem.gameItemId && entity.isUsing)
            useGameItem.isUsing = !checker.isNullOrUndefinedObject(usingMemberGameItem)
            if (useGameItem.isUsing) {
                useGameItem.usingMemberGameItemId = usingMemberGameItem.id
                useGameItem.usingRemainTimes = usingMemberGameItem.remainTimes
            }
        }

        return ret;


    }

    //TODO: 使用者的 所擁有的物品列表
    async getMemberGameItems(): Promise<ListResult<MemberGameItemVM>> {

        const memberGameItemRepository = await this.entityManager.getRepository(MemberGameItemEntity);


        const memberGameItemEntities = await memberGameItemRepository
            .createQueryBuilder("memberGameItem")
            .innerJoin("memberGameItem.gameItem", "gameItem", "gameItem.type in (:...types)")
            .where("memberGameItem.memberId = :memberId and memberGameItem.remainTimes > 0 and memberGameItem.enabled = 1")
            .orderBy("gameItem.type", "ASC")
            .addOrderBy("memberGameItem.is_using", "DESC")
            .setParameters({
                types: [GameItemType.tool, GameItemType.role],
                memberId: this.memberId
            })
            .getMany();


        const dic = _.groupBy<MemberGameItemEntity>(memberGameItemEntities, "gameItemId")

        const ret = new ListResult<MemberGameItemVM>(true);
        const items: MemberGameItemVM[] = []

        for (const key in dic) {
            const gameItem = dic[key][0].gameItem

            const item: MemberGameItemVM = {
                id: gameItem.id,
                imageUrl: gameItem.imageUrl,
                gamePoint: gameItem.gamePoint,
                type: gameItem.type,
                carPlusPoint: gameItem.gamePoint,
                description: gameItem.description,
                enableBuy: false,
                name: gameItem.name,
                isUsing: dic[key].some(entity => entity.isUsing),
                memberGameItemIds: dic[key].map(entity => entity.id)
            }
            items.push(item)

        }

        ret.items = items;

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

    async memberBuyGameItem(param: MemberBuyGameItemParameter, memberGamePointLibSvc: MemberGamePointLibSvc): Promise<BaseResult> {
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


        // 等級驗證
        if (gameItemEntity.levelMinLimit > -1 && level < gameItemEntity.levelMinLimit) {
            throw new AppError('等級不足，無法購買此道具')
        }

        const useGamePointItems = [GameItemType.tool, GameItemType.role, GameItemType.carPlusPoint]
        let pointAmount = 0
        let pointType: PointType = null
        // 金額驗證 
        if (useGamePointItems.some(item => item === gameItemEntity.type)) {
            pointAmount = gameItemEntity.gamePoint * param.num
            pointType = PointType.gamePoint
            // 用超人幣購買的
            if ((gameItemEntity.gamePoint * param.num) > gamePoint) {
                throw new AppError('超人幣不足，無法購買')
            }
        } else {
            pointAmount = gameItemEntity.carPlusPoint * param.num
            pointType = PointType.carPlus
            // 用格上紅利購嗎
            if ((gameItemEntity.carPlusPoint * param.num) > carPlusPoint) {
                throw new AppError('格上紅利不足，無法兌換超人幣')
            }
        }


        // 新增一筆紀錄
        const memberGameItemEntities: MemberGameItemEntity[] = [];
        for (let i = 0; i < num; i++) {
            memberGameItemEntities.push(await this.addMemberGameItem(gameItemEntity, memberGamePointLibSvc))
        }

        // 新增一筆兌換紀錄，後台會需要
        const memberGameItemOrder = new MemberGameItemOrderEntity();
        memberGameItemOrder.id = uniqueId.generateV4UUID();
        memberGameItemOrder.memberId = this.memberId;
        memberGameItemOrder.gameItemId = gameItemId;
        memberGameItemOrder.pointType = pointType
        memberGameItemOrder.gameItemCount = num
        memberGameItemOrder.pointAmount = pointAmount;
        memberGameItemOrder.dateCreated = new Date();
        // 紀錄第一筆
        memberGameItemOrder.memberGamePointHistoryId = memberGameItemEntities[0].memberGamePointHistoryId
        memberGameItemOrder.memberGameItemId = memberGameItemEntities[0].id

        await this.entityManager.getRepository(MemberGameItemEntity).insert(memberGameItemEntities);
        await this.entityManager.getRepository(MemberGameItemOrderEntity).insert(memberGameItemOrder);

        return new BaseResult(true);
    }

    private async addMemberGameItem(gameItemEntity: GameItemEntity, memberGamePointLibSvc: MemberGamePointLibSvc): Promise<MemberGameItemEntity> {
        const memberGameItemRepository = await this.entityManager.getRepository(MemberGameItemEntity)
        // 驗證
        switch (gameItemEntity.type) {
            case GameItemType.carPlusPoint:
                // 一天只能買限量
                const maxCarPlusPointAmountRet = await variableSvc.maxCarPlusPointAmountPerDay();

                // 先查出今天是否有購買過
                const findAndCountRet = await memberGameItemRepository.findAndCount({
                    relations: ['gameItem'],
                    where: {
                        gameItemId: gameItemEntity.id,
                        memberId: this.memberId,
                        dateCreated: Between(luxon.DateTime.local().startOf('day').toJSDate(), luxon.DateTime.local().endOf('day').toJSDate()),
                        gameItem: {
                            type: GameItemType.carPlusPoint
                        }
                    }
                })

                if (findAndCountRet[1] >= maxCarPlusPointAmountRet.item) {
                    throw new AppError('今日已達購賣數量上限')
                }

                break;
            case GameItemType.gamePoint:
            case GameItemType.role:
            case GameItemType.tool:
                break;
            default:
                throw new AppError('不支援的道具種類')
        }

        const memberGameItemEntity = new MemberGameItemEntity();
        memberGameItemEntity.id = uniqueId.generateV4UUID();
        memberGameItemEntity.gameItemId = gameItemEntity.id
        memberGameItemEntity.memberId = this.memberId
        memberGameItemEntity.memberGamePointHistoryId = null;
        memberGameItemEntity.dateLastUsed = null;
        memberGameItemEntity.dateCreated = new Date();
        memberGameItemEntity.dateUpdated = new Date();
        memberGameItemEntity.remainTimes = gameItemEntity.usedTimes
        memberGameItemEntity.totalUsedTimes = gameItemEntity.usedTimes;
        memberGameItemEntity.enabled = gameItemEntity.usedTimes > 0
        memberGameItemEntity.isUsing = false

        memberGameItemRepository.insert(memberGameItemEntity);

        let pointHistoryResult: Result<PointHistoryVM> = null;


        switch (gameItemEntity.type) {
            case GameItemType.tool:

                // 扣遊戲點數
                pointHistoryResult = await memberGamePointLibSvc.minusGamePointByBuyGameItem(
                    gameItemEntity.gamePoint,
                    {
                        gameItemId: gameItemEntity.id,
                        memberGameItemId: memberGameItemEntity.id
                    });

                break;
            case GameItemType.role:

                // 扣遊戲點數
                pointHistoryResult = await memberGamePointLibSvc.minusGamePointByBuyGameItem(
                    gameItemEntity.gamePoint,
                    {
                        gameItemId: gameItemEntity.id,
                        memberGameItemId: memberGameItemEntity.id
                    });

                break;
            case GameItemType.carPlusPoint:

                // 扣遊戲點數
                // 要加紅利
                pointHistoryResult = await memberGamePointLibSvc.addCarPlusPointByTransferFromGamePoint(
                    gameItemEntity.carPlusPoint,
                    gameItemEntity.gamePoint,
                    {
                        gameItemId: gameItemEntity.id,
                        memberGameItemId: memberGameItemEntity.id
                    });

                break;
            case GameItemType.gamePoint:

                // 要扣掉格上紅利
                // 加遊戲點數
                pointHistoryResult = await memberGamePointLibSvc.addGamePointByTransferFromCarPlusPoint(
                    gameItemEntity.carPlusPoint,
                    gameItemEntity.gamePoint,
                    {
                        gameItemId: gameItemEntity.id,
                        memberGameItemId: memberGameItemEntity.id
                    });
                break;
        }



        if (pointHistoryResult.success) {
            await memberGameItemRepository.update({ id: memberGameItemEntity.id }, { memberGamePointHistoryId: pointHistoryResult.item.id })
            memberGameItemEntity.memberGamePointHistoryId = pointHistoryResult.item.id;
        }




        return memberGameItemEntity;
    }

}