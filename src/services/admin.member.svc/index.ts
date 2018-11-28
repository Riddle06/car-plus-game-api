import { AdminMembersLibSvc } from './lib/admin.members.lib.svc';
import { AdminMemberBlockLibSvc } from './lib/admin.member.block.lib.svc';
import { PageQuery } from './../../view-models/common.vm';
import { AdminMemberBlockParameter, AdminMemberBlockHistoryVM, AdminMemberBlockListQueryParameterVM, AdminMemberListQueryParameterVM, AdminMemberGameItemVM, AdminMemberVM } from '@view-models/admin.member.vm';
import { AdminUserToken } from '@view-models/admin.auth.vm';
import { Result, ListResult } from '@view-models/common.vm';
import { dbProvider } from '@utilities';
import { ResponseExtension } from '@view-models/extension';
class AdminMemberSvc {

    async addMemberBlockHistory(adminUserToken: AdminUserToken, param: AdminMemberBlockParameter): Promise<Result<AdminMemberBlockHistoryVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const adminMemberBlockLibSvc = new AdminMemberBlockLibSvc(adminUserToken, queryRunner)
            const ret = await adminMemberBlockLibSvc.addMemberBlockHistory(param)
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async deleteMemberBlockHistory(adminUserToken: AdminUserToken, blockHistoryId: string) {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const adminMemberBlockLibSvc = new AdminMemberBlockLibSvc(adminUserToken, queryRunner)
            const ret = await adminMemberBlockLibSvc.deleteMemberBlockHistory(blockHistoryId)
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async getMemberBlockHistories(adminUserToken: AdminUserToken, param: PageQuery<AdminMemberBlockListQueryParameterVM>): Promise<ListResult<AdminMemberBlockHistoryVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const adminMemberBlockLibSvc = new AdminMemberBlockLibSvc(adminUserToken, queryRunner)
            const ret = await adminMemberBlockLibSvc.getMemberBlockHistories(param)
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async getAdminMemberWidthGameItemsList(param: PageQuery<AdminMemberListQueryParameterVM>): Promise<ListResult<AdminMemberVM>> {
        // TODO: 取得會員列表（包含道具
        return null
    }

    async exportAdminMemberWidthGameItemsListExcel(res: ResponseExtension): Promise<void> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const adminMembersLibSvc = new AdminMembersLibSvc(queryRunner)
            const ret = await adminMembersLibSvc.exportMembersWithGameItemsExcel(res)
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

}

export const adminMemberSvc = new AdminMemberSvc();