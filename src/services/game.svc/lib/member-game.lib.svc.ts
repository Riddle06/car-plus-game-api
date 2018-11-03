import { CatchGameType } from './game-types/catch.game.type';
import { GameEntity } from '@entities/game.entity';
import { BaseConnection } from "@services/base-connection";
import { QueryRunner } from "typeorm";
import { Result, AppError } from "@view-models/common.vm";
import { StartGameHistoryVM, PlayGameParameterVM, ReportPlayGameParameterVM } from "@view-models/game-history.vm";
import { ShotGameType } from './game-types/shot.game.type';
import { checker } from '@utilities';
import { MemberGameHistoryEntity } from '@entities/member-game-history.entity';

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
        return memberGameType.startGame()
    }

    async reportGame(param: ReportPlayGameParameterVM): Promise<Result<StartGameHistoryVM>> {
        const { gameHistoryId, scoreEncryptString } = param;

        const memberGameHistoryRepository = await this.entityManager.getRepository(MemberGameHistoryEntity)
        const gameEntity = await memberGameHistoryRepository.findOne({
            relations: ['game'],
            where: {
                id: gameHistoryId
            }
        });
        if (checker.isNullOrUndefinedObject(gameEntity)) {
            throw new AppError('查無此遊戲')
        }
        const memberGameType = await this.getMemberGame(gameEntity.game);
        const score = memberGameType.getScoreByEncryptString(scoreEncryptString)
        return memberGameType.reportGame(score)
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

export abstract class BaseMemberGame extends BaseConnection {
    protected memberId: string = null
    protected game: GameEntity = null;
    constructor(memberId: string, game: GameEntity, queryRunner: QueryRunner) {
        super(queryRunner)
        this.memberId = memberId;
        this.game = game;
    }
    async init(): Promise<this> {
        return this;
    }
    abstract startGame(): Promise<Result<StartGameHistoryVM>>
    abstract reportGame(score: number): Promise<Result<StartGameHistoryVM>>

    getScoreByEncryptString(encryptString: string): number {

        try {
            const ret = parseInt(atob(atob(encryptString)))
            return ret;
        } catch (error) {
            throw new AppError('參數錯誤')
        }
    }
}