import { Result, PageInfo, ListResult } from '@view-models/common.vm';
import { BaseWebSvc } from "./base-web.svc";
import { AdminGameDashboardVM } from '@view-models/admin.game.vm';
import { GameVM } from '@view-models/game.vm';
export class AdminGameWebSvc extends BaseWebSvc {

    /**
     * 取得營運報表
     * @param pageInfo.dateStart 查詢開始時間 
     * @param pageInfo.dateEnd 查詢結束時間 
     */
    async getDashboard(pageInfo: PageInfo): Promise<Result<AdminGameDashboardVM>> {
        const res = await this.axiosAdminInstance.get('/admin/api/game/dashboard', {
            params: {
                ...pageInfo,
            }
        })
        return res.data;
    }


    async getGameList(): Promise<ListResult<GameVM>> {
        const res = await this.axiosAdminInstance.get('/admin/api/game')
        return res.data;
    }

    async updateGame(id: string, parameter: object): Promise<Result<GameVM>> {
        const res = await this.axiosAdminInstance.put(`/admin/api/game/${id}`, {
            ...parameter
        })
        return res.data;
    }

}