import { AdminGameLibSvc } from './lib/admin.game.lib.svc';
import { GameVM } from '@view-models/game.vm';
import { AdminGameDashboardLibSvc } from './lib/admin.game.dashboard.lib.svc';
import { AdminGameHistoryLibSvc } from './lib/admin.game.history.lib.svc';
import { AdminMemberGameHistoryParameterVM, AdminMemberGameHistoryVM, AdminGameDashboardVM } from '@view-models/admin.game.vm';
import { PageQuery, ListResult, Result } from './../../view-models/common.vm';
import { dbProvider } from '@utilities';
import { ExportResult } from '@utilities/exporter';

class AdminGameSvc {


    async getGameList(): Promise<ListResult<GameVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const adminGameLibSvc = new AdminGameLibSvc(queryRunner)
            const ret = await adminGameLibSvc.getGameList()
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async updateGame(id: string, parameter: object): Promise<Result<GameVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const adminGameLibSvc = new AdminGameLibSvc(queryRunner)
            const ret = await adminGameLibSvc.updateGameParameter(id, parameter)
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }


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

    async exportGameHistory(param: PageQuery<AdminMemberGameHistoryParameterVM>): Promise<ExportResult> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const adminGameHistoryLibSvc = new AdminGameHistoryLibSvc(queryRunner)
            const ret = await adminGameHistoryLibSvc.exportGameHistory(param)
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async getGameDashboard(params: PageQuery): Promise<Result<AdminGameDashboardVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const adminGameDashboardLibSvc = new AdminGameDashboardLibSvc(queryRunner)
            const ret = await adminGameDashboardLibSvc.getGameDashboard(params)
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async exportGameDashboard(params: PageQuery): Promise<ExportResult> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const adminGameDashboardLibSvc = new AdminGameDashboardLibSvc(queryRunner)
            const ret = await adminGameDashboardLibSvc.exportGameDashboard(params)
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

}

export const adminGameSvc = new AdminGameSvc();