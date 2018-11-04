import { GameEntity } from "@entities/game.entity";
import { BaseConnection } from "@services/base-connection";
import { QueryRunner } from "typeorm";
import { StartGameHistoryVM } from "@view-models/game-history.vm";
import { AppError, Result } from "@view-models/common.vm";

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