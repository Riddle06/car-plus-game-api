import { AdminUserVM, AdminUserLoginParameterVM } from '@view-models/admin.auth.vm';
import { Result, BaseResult } from '@view-models/common.vm';
import { BaseWebSvc } from "./base-web.svc";
export class AdminAuthWebSvc extends BaseWebSvc {

    /**
     * admin 登入
     * @param param 
     */
    async login(param: AdminUserLoginParameterVM): Promise<Result<string>> {
        const res = await this.axiosAdminInstance.post<Result<string>>('/admin/api/auth/login', param)
        return res.data;
    }

    /**
     * admin 登出 ， 目前 server 沒做什麼
     */
    async logout(): Promise<BaseResult> {
        const res = await this.axiosAdminInstance.post<Result<string>>('/admin/api/auth/logout')
        return res.data;
    }

    /**
     * 取得admin登入資訊
     */
    async getProfile(): Promise<Result<AdminUserVM>> {
        const res = await this.axiosAdminInstance.get<Result<AdminUserVM>>('/admin/api/auth')
        return res.data;
    }


}