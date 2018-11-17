import { AdminUserVM } from './../../view-models/admin.auth.vm';
import { AdminInformationLibSvc } from './lib/information.lib.svc';
import { BaseResult } from './../../view-models/common.vm';
import { LoginLibSvc } from './lib/login.lib.svc';
import { VerificationLibSvc } from './lib/verification.lib.svc';
import { Result } from "@view-models/common.vm";
import { AdminUserToken, AdminUserLoginParameterVM } from "@view-models/admin.auth.vm";
import { dbProvider } from '@utilities';

class AdminAuthSvc {

    async login(clientId: string, param: AdminUserLoginParameterVM): Promise<Result<string>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const loginLibSvc = new LoginLibSvc(queryRunner)
            const ret = await loginLibSvc.login(clientId, param)
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async logout(): Promise<BaseResult> {
        return new BaseResult(true);
    }

    async getProfile(token: AdminUserToken): Promise<Result<AdminUserVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const informationLibSvc = new AdminInformationLibSvc(queryRunner)
            const ret = await informationLibSvc.getProfile(token.payload.id)
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async verifyAndParseToken(path: string, token: string): Promise<Result<AdminUserToken>> {

        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const verificationLibSvc = new VerificationLibSvc(queryRunner)
            const ret = await verificationLibSvc.verify(path, token)
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

export const adminAuthSvc = new AdminAuthSvc();