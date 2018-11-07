import { variableSvc } from '@services/variable.svc';
import { GameEntity } from "@entities/game.entity";
import { BaseConnection } from "@services/base-connection";
import { QueryRunner, MoreThan, Repository } from 'typeorm';
import { StartGameHistoryVM } from "@view-models/game-history.vm";
import { AppError, Result } from "@view-models/common.vm";
import { MemberGameItemEntity } from "@entities/member-game-item.entity";
import { MemberGameHistoryGameItemEntity } from "@entities/member-game-history-game-item.entity";
import { GameItemVM, GameItemType } from '@view-models/game.vm';
import { MemberGameHistoryEntity } from "@entities/member-game-history.entity";
import { uniqueId } from "@utilities";
import { MemberEntity } from "@entities/member.entity";
import { GameItemEntity } from '@entities/game-item.entity';
import { MemberGamePointLibSvc } from "../member-game-point.lib.svc";

export abstract class BaseMemberGame extends BaseConnection {
    protected memberId: string = null
    protected game: GameEntity = null;

    protected memberGameHistoryRepository: Repository<MemberGameHistoryEntity> = null
    protected memberGameHistoryMemberGameItemRepository: Repository<MemberGameHistoryGameItemEntity> = null
    protected memberRepository: Repository<MemberEntity> = null


    constructor(memberId: string, game: GameEntity, queryRunner: QueryRunner) {
        super(queryRunner)
        this.memberId = memberId;
        this.game = game;

        this.memberGameHistoryRepository = this.entityManager.getRepository(MemberGameHistoryEntity);
        this.memberGameHistoryMemberGameItemRepository = this.entityManager.getRepository(MemberGameHistoryGameItemEntity);
        this.memberRepository = this.entityManager.getRepository(MemberEntity);
    }

    abstract getExperienceByScore(score: number): Promise<number>

    async getUseGameItemGamePoint(oriGamePoint: number, gameItemEntities: GameItemEntity[]): Promise<number> {

        return oriGamePoint;
    }



    async init(): Promise<this> {
        return this;
    }

    async startGame(): Promise<Result<StartGameHistoryVM>> {
        const ret = new Result<StartGameHistoryVM>();

        const history = new MemberGameHistoryEntity();
        history.id = uniqueId.generateV4UUID();
        history.afterExperience = -1
        history.afterLevel = -1
        history.beforeExperience = -1
        history.beforeLevel = -1
        history.changeExperience = -1
        history.changeLevel = -1
        history.dateCreated = new Date();
        history.dateFinished = null
        history.gameId = this.game.id;
        history.gameScore = -1
        history.memberId = this.memberId;
        // history.changeGamePoint =null

        await this.memberGameHistoryRepository.insert(history);

        return ret.setResultValue(true)
    }

    async validateReportGame(): Promise<void> {

    }

    async reportGame(memberGameHistoryId: string, score: number,
        gamePoint: number,
        memberGamePointLibSvc: MemberGamePointLibSvc): Promise<Result<StartGameHistoryVM>> {

        const memberGameHistoryMemberGameItemEntities = await this.memberGameHistoryMemberGameItemRepository.find({
            relations: ['memberGameItem', 'memberGameItem.gameItem'],
            where: {
                memberGameHistoryId
            }
        })
        const memberEntity = await this.memberRepository.findOne(this.memberId);

        const enableAddGamePointGameItems = memberGameHistoryMemberGameItemEntities.filter(entity => entity.memberGameItem.gameItem.type === GameItemType.tool && entity.memberGameItem.gameItem.enabledAddGamePointRate).map(entity => entity.memberGameItem.gameItem);

        const enableAddScoreGameItems = memberGameHistoryMemberGameItemEntities.filter(entity => entity.memberGameItem.gameItem.type === GameItemType.tool && entity.memberGameItem.gameItem.enabledAddScoreRate).map(entity => entity.memberGameItem.gameItem);

        // 因為遊戲分數加成得到的分數
        const totalScore = await this.getTotalScore(score, enableAddScoreGameItems);

        // 取得經驗值（目前跟分數是 1 : 1)
        const changeExperience = await this.getExperienceByScore(totalScore);

        // 因為遊戲道具加成後得到的金幣
        const gamePointAfterAddBonus = await this.getUseGameItemGamePoint(gamePoint, enableAddGamePointGameItems);

        const { changeLevel, levelUpGamePoint, newExperience } = await this.getLevelUpInfoByExperience(memberEntity.level, memberEntity.experience, changeExperience);

        // 更新遊戲紀錄
        await this.memberGameHistoryRepository.update(
            { id: memberGameHistoryId },
            {
                beforeExperience: memberEntity.experience,
                changeExperience,
                afterExperience: newExperience,
                changeLevel,
                afterLevel: memberEntity.level + changeLevel,
                beforeLevel: memberEntity.level,
                gameScore: totalScore
            });

        // 更新會員紀錄
        await this.memberRepository.update({ id: this.memberId },
            {
                experience: newExperience,
                level: memberEntity.level + changeLevel,
            })


        // 增加遊戲點數
        await memberGamePointLibSvc.addGamePointByGame(gamePointAfterAddBonus + levelUpGamePoint, memberGameHistoryId)

        return;
    }

    async getTotalScore(oriScore: number, gameItems: GameItemEntity[]): Promise<number> {

        const ret = gameItems.filter(item => item.enabledAddScoreRate).reduce((totalScore, item) => {
            return totalScore * item.addScoreRate
        }, oriScore)

        return ret;
    }


    async getUsingItemToUse(memberGameItemHistoryId: string): Promise<GameItemVM[]> {
        const gameItems: GameItemVM[] = [];

        const memberGameItemEntities = await this.entityManager.getRepository(MemberGameItemEntity).find({
            relations: ['gameItem'],
            where: {
                isUsing: true,
                remainTimes: MoreThan(0),
                memberId: this.memberId
            }
        });

        const memberGameHistoryGameItemRepository = this.entityManager.getRepository(MemberGameHistoryGameItemEntity);

        for (const entity of memberGameItemEntities) {
            entity.remainTimes -= - 1;
            entity.dateLastUsed = new Date();
            entity.dateUpdated = new Date();

            if (entity.remainTimes === 0) {
                entity.isUsing = false;
                entity.enabled = false;
            }

            entity.save();

            const memberGameHistoryGameItemEntity = new MemberGameHistoryGameItemEntity();
            memberGameHistoryGameItemEntity.memberGameItemId = entity.id
            memberGameHistoryGameItemEntity.memberGameHistoryId = memberGameItemHistoryId
            memberGameHistoryGameItemEntity.dateCreated = new Date();
            memberGameHistoryGameItemEntity.dateUpdated = new Date();
            await memberGameHistoryGameItemRepository.insert(memberGameHistoryGameItemEntity)


            gameItems.push({
                addGamePointRate: entity.gameItem.addGamePointRate,
                addScoreRate: entity.gameItem.addScoreRate,
                id: entity.gameItem.id,
                description: entity.gameItem.description,
                name: entity.gameItem.name,
                imageUrl: entity.gameItem.imageUrl,
                gamePoint: entity.gameItem.gamePoint,
                carPlusPoint: entity.gameItem.carPlusPoint,
                type: entity.gameItem.type,
                enableBuy: true
            });
        }


        return gameItems;
    }

    async getLevelUpInfoByExperience(currentLevel: number, currentExperience: number, changeExperience: number): Promise<{
        changeLevel: number,
        levelUpGamePoint: number,
        newExperience: number
    }> {

        let changeLevel = 0;
        let levelUpGamePoint = 0;
        let newExperience = currentExperience + changeExperience;
        const levelInformation = await variableSvc.getLevelInformation();



        for (let i = 0; i < levelInformation.items.length; i++) {
            const item = levelInformation.items[i];

            if (currentLevel > item.level) { continue; }

            if (i === (levelInformation.items.length - 1)) { continue; }

            if (currentLevel === item.level) {
                const nextItem = levelInformation.items[i + 1];

                if (newExperience >= nextItem.experience) {
                    newExperience = changeExperience + currentExperience - nextItem.experience;
                    currentLevel += 1;
                    changeLevel += 1;
                    levelUpGamePoint += nextItem.levelUpGetGamePoint

                }
            }
        }

        return {
            levelUpGamePoint,
            changeLevel,
            newExperience
        };
    }

    getScoreByEncryptString(encryptString: string): number {

        try {
            const ret = parseInt(atob(atob(encryptString)))
            return ret;
        } catch (error) {
            throw new AppError('參數錯誤')
        }
    }

    getPointByEncryptString(encryptString): number {
        try {
            const ret = parseInt(atob(atob(encryptString)))
            return ret;
        } catch (error) {
            throw new AppError('參數錯誤')
        }
    }

}