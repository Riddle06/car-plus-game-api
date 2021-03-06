import { AdminMembersLibSvc } from './lib/admin.members.lib.svc';
import { AdminMemberBlockLibSvc } from './lib/admin.member.block.lib.svc';
import { PageQuery } from './../../view-models/common.vm';
import { AdminMemberBlockParameter, AdminMemberBlockHistoryVM, AdminMemberBlockListQueryParameterVM, AdminMemberListQueryParameterVM, AdminMemberGameItemVM, AdminMemberVM } from '@view-models/admin.member.vm';
import { AdminUserToken } from '@view-models/admin.auth.vm';
import { Result, ListResult } from '@view-models/common.vm';
import { dbProvider } from '@utilities';
import { ExportResult } from '@utilities/exporter';
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

    async getAdminMemberList(param: PageQuery<AdminMemberListQueryParameterVM>): Promise<ListResult<AdminMemberVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const adminMemberLibSvc = new AdminMembersLibSvc(queryRunner)
            const ret = await adminMemberLibSvc.getMembers(param)
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async getAdminMemberWithGameItemsDetail(id: string): Promise<Result<AdminMemberVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const adminMemberLibSvc = new AdminMembersLibSvc(queryRunner)
            const ret = await adminMemberLibSvc.getMemberDetail(id)
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async exportAdminMemberWidthGameItemsListExcel(param: PageQuery<AdminMemberListQueryParameterVM>): Promise<ExportResult> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const adminMembersLibSvc = new AdminMembersLibSvc(queryRunner)
            const ret = await adminMembersLibSvc.exportMembersWithGameItemsExcel(param)
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

export const adminMemberSvc = new AdminMemberSvc();