import { Result, PageInfo } from '@view-models/common.vm';
import { BaseWebSvc } from "./base-web.svc";
export class AdminGameWebSvc extends BaseWebSvc {

    async getDashboard(pageInfo: PageInfo = { index: 1, size: 10 }) {
        
    }

}