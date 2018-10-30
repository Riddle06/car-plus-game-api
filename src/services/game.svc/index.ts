import { ListResult, Result, BaseResult } from "@view-models/common.vm";
import { GameItemVM, MemberBuyGameItemParameter } from '@view-models/game.vm';
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
            const ret = await libGameSvc.getGameList();
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

    async getGameItems(memberToken: MemberToken): Promise<ListResult<GameItemVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const gameLibSvc = new GameLibSvc(queryRunner);
            const ret = await gameLibSvc.getGameItems(null);
            await queryRunner.commitTransaction();
            return ret;
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

    async memberUseGameItem(memberToken: MemberToken, memberGameItemId: string): Promise<BaseResult> {
        const memberId = memberToken.payload.mi;
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const memberGameItemLibSvc = new MemberGameItemLibSvc(memberId, queryRunner)
            const ret = await memberGameItemLibSvc.useGameItem(memberGameItemId)
            await queryRunner.commitTransaction();
            return ret
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async memberBuyGameItem(memberToken: MemberToken, param: MemberBuyGameItemParameter): Promise<BaseResult> {
        return null
    }

}



export const gameSvc = new GameSvc();