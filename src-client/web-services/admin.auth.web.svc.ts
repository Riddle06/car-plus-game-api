import { AdminUserVM, AdminUserLoginParameterVM } from '@view-models/admin.auth.vm';
import { Result, BaseResult } from '@view-models/common.vm';
import { BaseWebSvc } from "./base-web.svc";
export class AdminAuthWebSvc extends BaseWebSvc {

    async login(param: AdminUserLoginParameterVM): Promise<Result<string>> {
        const res = await this.axiosAdminInstance.post<Result<string>>('/admin/api/auth/login', param)
        return res.data;
    }

    async logout(): Promise<BaseResult> {
        const res = await this.axiosAdminInstance.post<Result<string>>('/admin/api/auth/logout')
        return res.data;
    }

    async getProfile(): Promise<Result<AdminUserVM>> {
        const res = await this.axiosAdminInstance.get<Result<AdminUserVM>>('/admin/api/auth')
        return res.data;
    }


}