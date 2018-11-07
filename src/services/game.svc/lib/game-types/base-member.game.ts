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

    abstract getGamePointByScore(score: number, gameItemEntities: GameItemEntity[]): Promise<number>



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

    async reportGame(memberGameHistoryId: string, score: number, memberGamePointLibSvc: MemberGamePointLibSvc): Promise<Result<StartGameHistoryVM>> {

        const memberGameHistoryMemberGameItemEntities = await this.memberGameHistoryMemberGameItemRepository.find({
            relations: ['memberGameItem', 'memberGameItem.gameItem'],
            where: {
                memberGameHistoryId
            }
        })
        const memberEntity = await this.memberRepository.findOne(this.memberId);

        const enableAddGamePointGameItems = memberGameHistoryMemberGameItemEntities.filter(entity => entity.memberGameItem.gameItem.type === GameItemType.tool && entity.memberGameItem.gameItem.enabledAddGamePointRate).map(entity => entity.memberGameItem.gameItem);

        const enableAddScoreGameItems = memberGameHistoryMemberGameItemEntities.filter(entity => entity.memberGameItem.gameItem.type === GameItemType.tool && entity.memberGameItem.gameItem.enabledAddScoreRate).map(entity => entity.memberGameItem.gameItem);


        const totalScore = await this.getTotalScore(score, enableAddScoreGameItems);
        const changeExperience = await this.getExperienceByScore(totalScore);
        const gamePoint = await this.getGamePointByScore(totalScore, enableAddGamePointGameItems);
        const changeLevel = await this.getLevelByExperience(memberEntity.level, memberEntity.experience, changeExperience)

        this.memberGameHistoryRepository.update(
            { id: memberGameHistoryId },
            {
                beforeExperience: memberEntity.experience,
                changeExperience,
                afterExperience: memberEntity.experience + changeExperience,
                changeLevel,
                afterLevel: memberEntity.level + changeLevel,
                beforeLevel: memberEntity.level,
                gameScore: totalScore
            });



        // update member entity
        await this.memberRepository.update({ id: this.memberId },
            {
                experience: memberEntity.experience + changeExperience,
                level: memberEntity.level + changeLevel,
            })


        // 增加遊戲點數
        await memberGamePointLibSvc.addGamePointByGame(gamePoint, memberGameHistoryId)

        return;
    }

    async getTotalScore(oriScore: number, gameItems: GameItemEntity[]): Promise<number> {
        return 0
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

    async getLevelByExperience(currentLevel: number, currentExperience: number, changeExperience: number): Promise<number> {
        throw new Error('尚未實作')
    }

    getScoreByEncryptString(encryptString: string): number {

        try {
            const ret = parseInt(atob(atob(encryptString)))
            return ret;
        } catch (error) {
            throw new AppError('參數錯誤')
        }
    }

}