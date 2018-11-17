import { AdminMemberGameHistoryParameterVM, AdminMemberGameHistoryVM, AdminGameDashboardVM } from '@view-models/admin.game.vm';
import { PageQuery, ListResult, Result } from './../../view-models/common.vm';
import { ListQueryParameter } from "@view-models/common.vm";

class AdminGameSvc {

    async getGameHistory(param: PageQuery<AdminMemberGameHistoryParameterVM>): Promise<ListResult<AdminMemberGameHistoryVM>> {
        // TODO:
        return null;
    }

    async getGameDashboard(params: PageQuery): Promise<Result<AdminGameDashboardVM>> {
        // TODO:
        return null
    }

}

export const adminGameSvc = new AdminGameSvc();