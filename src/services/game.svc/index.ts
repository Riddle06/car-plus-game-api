import { ListResult } from "@view-models/common.vm";
import { GameVM } from "@view-models/game.vm";
import { GameLibSvc } from "./lib/game.lib.svc";
import { dbProvider } from "@utilities";

class GameSvc {
    async getGameList(): Promise<ListResult<GameVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const libGameSvc = new GameLibSvc(queryRunner)
            return libGameSvc.getGameList();
        } catch (error) {
            queryRunner.rollbackTransaction();
            throw error
        } finally {
            queryRunner.release();
        }
    }
}

export const gameSvc = new GameSvc();