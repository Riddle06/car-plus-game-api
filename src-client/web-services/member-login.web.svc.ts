import { Result } from '@view-models/common.vm';
import { BaseWebSvc } from "./base-web.svc";
import { MemberLoginCreateParameterVM } from "@view-models/member.vm";

export class MemberLoginWebSvc extends BaseWebSvc {
    /**
     * 新增一筆登入紀錄，應該用不到，在 client middleware 做掉了
     * @param param 
     */
    async addMemberLogin(param: MemberLoginCreateParameterVM): Promise<Result<string>> {
        const ret = await this.axiosInstance.post<Result<string>>('/api/member/login', param)
        return ret.data
    }
}