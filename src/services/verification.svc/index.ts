import { Result, BaseResult } from "@view-models/common.vm";
import { MemberToken } from "@view-models/verification.vm";
import { dbProvider } from "@utilities";
import { VerificationLibSvc } from "./lib/verification.lib";

class VerificationSvc {

    async verifyAndParseToken(path: string, token: string): Promise<Result<MemberToken>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const verificationLibSvc = new VerificationLibSvc(queryRunner)
            const ret = await verificationLibSvc.verifyToken(token)
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

export const verificationSvc = new VerificationSvc();