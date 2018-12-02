import { MemberEntity } from './../../../entities/member.entity';
import { CatchGameType } from './game-types/catch.game.type';
import { GameEntity } from '@entities/game.entity';
import { BaseConnection } from "@services/base-connection";
import { QueryRunner } from "typeorm";
import { Result, AppError } from "@view-models/common.vm";
import { StartGameHistoryVM, PlayGameParameterVM, ReportPlayGameParameterVM } from "@view-models/game-history.vm";
import { ShotGameType } from './game-types/shot.game.type';
import { checker } from '@utilities';
import { MemberGameHistoryEntity } from '@entities/member-game-history.entity';
import { BaseMemberGame } from './game-types/base-member.game';
import { MemberGamePointLibSvc } from './member-game-point.lib.svc';

export class MemberGameLibSvc extends BaseConnection {
    private memberId: string = null
    constructor(memberId: string, queryRunner: QueryRunner) {
        super(queryRunner)
        this.memberId = memberId;
    }

    async startGame(param: PlayGameParameterVM): Promise<Result<StartGameHistoryVM>> {
        const { gameId } = param;
        const gameRepository = await this.entityManager.getRepository(GameEntity)
        const gameEntity = await gameRepository.findOne(gameId);

        if (checker.isNullOrUndefinedObject(gameEntity)) {
            throw new AppError('查無此遊戲')
        }
        const memberGameType = await this.getMemberGame(gameEntity);

        // 先註冊遊戲資料
        const ret = await memberGameType.startGame();
        // 處理遊戲使用的道具
        const gameItems = await memberGameType.getUsingItemToUse(ret.item.id);

        ret.item.usedItems = gameItems;

        return ret;
    }

    async reportGame(param: ReportPlayGameParameterVM, memberGamePointLibSvc: MemberGamePointLibSvc): Promise<Result<StartGameHistoryVM>> {
        const { gameHistoryId, scoreEncryptString, gamePintEncryptString } = param;

        const memberGameHistoryRepository = await this.entityManager.getRepository(MemberGameHistoryEntity)
        const gameEntity = await memberGameHistoryRepository.findOne({
            relations: ['gameVM'],
            where: {
                id: gameHistoryId
            }
        });
        if (checker.isNullOrUndefinedObject(gameEntity)) {
            throw new AppError('查無此遊戲')
        }
        const memberGameType = await this.getMemberGame(gameEntity.gameVM);
        await memberGameType.validateReportGame(gameHistoryId);
        const score = memberGameType.getScoreByEncryptString(scoreEncryptString)
        const gamePoint = memberGameType.getPointByEncryptString(gamePintEncryptString)
        return memberGameType.reportGame(gameHistoryId, score, gamePoint, memberGamePointLibSvc)
    }

    async getGameHistory(id: string): Promise<Result<StartGameHistoryVM>> {

        const memberGameHistoryRepository = await this.entityManager.getRepository(MemberGameHistoryEntity)

        const memberGameHistoryEntity = await memberGameHistoryRepository.findOne({
            relations: ['gameVM'],
            where: {
                id
            }
        })

        if (checker.isNullOrUndefinedObject(memberGameHistoryEntity)) {
            throw new AppError('查無此紀錄')
        }

        if (checker.isNullOrUndefinedObject(memberGameHistoryEntity.gameVM)) {
            throw new AppError('查無此紀錄遊戲')
        }
        
        const memberGameType = await this.getMemberGame(memberGameHistoryEntity.gameVM);

        return await memberGameType.getGameHistory(memberGameHistoryEntity)
    }

    async getMemberGame(game: GameEntity): Promise<BaseMemberGame> {
        
        switch (game.code) {
            case "catch":
                return await (new CatchGameType(this.memberId, game, this.queryRunner).init())
            case "shot":
                return await (new ShotGameType(this.memberId, game, this.queryRunner).init())
            default:
                throw new AppError('不支援的遊戲類型')
        }
    }

}

