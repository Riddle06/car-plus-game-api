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

