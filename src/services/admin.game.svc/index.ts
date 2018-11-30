import { AdminGameHistoryLibSvc } from './lib/admin.game.history.lib.svc';
import { AdminMemberGameHistoryParameterVM, AdminMemberGameHistoryVM, AdminGameDashboardVM } from '@view-models/admin.game.vm';
import { PageQuery, ListResult, Result } from './../../view-models/common.vm';
import { ListQueryParameter } from "@view-models/common.vm";
import { dbProvider } from '@utilities';

class AdminGameSvc {

    /**
     * 
     */
    async getGameHistory(param: PageQuery<AdminMemberGameHistoryParameterVM>): Promise<ListResult<AdminMemberGameHistoryVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const adminGameHistoryLibSvc = new AdminGameHistoryLibSvc(queryRunner)
            const ret = await adminGameHistoryLibSvc.getGameHistory(param)
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async exportGameHistory(param: PageQuery<AdminMemberGameHistoryParameterVM>): Promise<Buffer> { 
        // TODO: 遊戲紀錄
        return null;
    }

    async getGameDashboard(params: PageQuery): Promise<Result<AdminGameDashboardVM>> {
        // TODO: 遊戲營運總表
        return null
    }

    async exportGameDashboard(params: PageQuery): Promise<Buffer> {
        // TODO: 匯出遊戲營運總表
        return null;
    }

}

export const adminGameSvc = new AdminGameSvc();