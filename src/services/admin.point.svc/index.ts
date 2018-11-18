import { AdminExchangeLibSvc } from './lib/admin.exchange.lib.svc';
import { AdminMemberGameItemOrderVM, AdminMemberGameItemQueryParameterVM } from './../../view-models/admin.point.vm';
import { ListResult } from '@view-models/common.vm';
import { AdminPointLibSvc } from './lib/admin.point.lib.svc';
import { CreateAdminMemberPointHistoryParameterVM, AdminMemberPointHistoryVM } from '@view-models/admin.point.vm';
import { AdminUserToken } from '@view-models/admin.auth.vm';
import { Result, PageQuery } from '@view-models/common.vm';
import { dbProvider } from '@utilities';
class AdminPointSvc {

    async getExchangeOrders(param: PageQuery<AdminMemberGameItemQueryParameterVM>): Promise<ListResult<AdminMemberGameItemOrderVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const adminExchangeLibSvc = new AdminExchangeLibSvc(queryRunner);
            const ret = adminExchangeLibSvc.getExchangeOrders(param)
            await queryRunner.commitTransaction();
            return ret
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 客訴補點列表
     */
    async getManualGamePointHistories(adminUserToken: AdminUserToken, param: PageQuery): Promise<ListResult<AdminMemberPointHistoryVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            // const memberGameItemLibSvc = new MemberGameItemLibSvc(memberId, queryRunner)
            const adminPointLibSvc = new AdminPointLibSvc(adminUserToken, queryRunner);
            const ret = adminPointLibSvc.getManualGamePointHistory(param)
            await queryRunner.commitTransaction();
            return ret
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 客訴補點
     */
    async addPoint(adminUserToken: AdminUserToken, param: CreateAdminMemberPointHistoryParameterVM): Promise<Result<AdminMemberPointHistoryVM>> {

        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const adminPointLibSvc = new AdminPointLibSvc(adminUserToken, queryRunner);
            const ret = await adminPointLibSvc.addPoint(param);
            return ret
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }

    }

}

export const adminPointSvc = new AdminPointSvc();