import { AdminUserVM, AdminUserLoginParameterVM } from '@view-models/admin.auth.vm';
import { Result, BaseResult } from '@view-models/common.vm';
import { BaseWebSvc } from "./base-web.svc";
import * as moment from "moment";
type ExportParameter = {
    token: string
    dateStart?: Date
    dateEnd?: Date
    /**
     * member id
     */
    mi?: string
    /**
     * 關鍵字，用在會員列表
     */
    keyword?: string
}

/**
 * 匯出 excel 
 */
export class AdminExportWebSvc extends BaseWebSvc {

    /**
     * 營運報表
     * @param param 
     */
    getExportDashboardLink(param: ExportParameter): string {
        return `/admin/api/export/dashboard?${this.getQueryString(param)}`
    }

    /**
     * 遊戲紀錄
     * @param param 
     */
    getExportGameHistoryLink(param: ExportParameter): string {
        return `/admin/api/export/member/game/history?${this.getQueryString(param)}`
    }

    /**
     * 兌換紀錄
     * @param param 
     */
    getExportGamePointHistoryLink(param: ExportParameter): string {
        return `/admin/api/export/member/point/history?${this.getQueryString(param)}`
    }

    /**
     * 會員報表
     * @param param 
     */
    getExportMemberWithGameItems(param: ExportParameter): string {
        return `/admin/api/export/member/with-game-items?${this.getQueryString(param)}`
    }

    getQueryString(param: ExportParameter): string {

        const { token, dateEnd, dateStart, mi, keyword } = param;

        const queryStringList: string[] = [`token=${token}`];

        if (dateEnd) {
            queryStringList.push(`dateEnd=${encodeURIComponent(moment(dateEnd).toISOString())}`)
        }

        if (dateStart) {
            queryStringList.push(`dateStart=${encodeURIComponent(moment(dateStart).toISOString())}`)
        }

        if (mi) {
            queryStringList.push(`mi=${mi}`)
        }

        if (keyword) {
            queryStringList.push(`keyword=${encodeURIComponent(keyword)}`)
        }

        return queryStringList.join("&")
    }

}