import { ListResult, Result, BaseResult } from "@view-models/common.vm";
import { GameVM, MemberGameItemVM } from "@view-models/game.vm";
import { GameLibSvc } from "./lib/game.lib.svc";
import { dbProvider } from "@utilities";
import { MemberToken } from "@view-models/verification.vm";
import { PlayGameParameterVM, StartGameHistoryVM } from "@view-models/game-history.vm";
import { MemberGameItemLibSvc } from "./lib/member-game-item.lib.svc";

class GameSvc {
    async getGameList(): Promise<ListResult<GameVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const libGameSvc = new GameLibSvc(queryRunner)
            const ret = libGameSvc.getGameList();
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async startGame(memberToken: MemberToken, param: PlayGameParameterVM): Promise<Result<StartGameHistoryVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const libGameSvc = new GameLibSvc(queryRunner)
            await queryRunner.commitTransaction();
            return null
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async reportGame(memberToken: MemberToken): Promise<BaseResult> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {

            await queryRunner.commitTransaction();
            return null
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }


    async getMemberItems(memberToken: MemberToken): Promise<ListResult<MemberGameItemVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const memberGameItemLibSvc = new MemberGameItemLibSvc(memberToken.payload.mi, queryRunner)
            const ret = await memberGameItemLibSvc.getMemberGameItems()
            await queryRunner.commitTransaction();
            return ret
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

}



export const gameSvc = new GameSvc();