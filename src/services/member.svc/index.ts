import { MemberInformationVM, MemberUpdateInformationParameterVM } from "@view-models/member.vm";
import { Result } from "@view-models/common.vm";
import { dbProvider } from "@utilities";
import { MemberInformationLibSvc } from "./lib/information.lib.svc";
import { MemberToken } from "@view-models/verification.vm";

class MemberSvc {

    async getMemberInformation(memberToken: MemberToken): Promise<Result<MemberInformationVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const memberInfoLibSvc = new MemberInformationLibSvc(memberToken.payload.mi, queryRunner)
            return memberInfoLibSvc.getInformation()
        } catch (error) {
            queryRunner.rollbackTransaction();
            throw error
        } finally {
            queryRunner.release();
        }

    }

    async updateMemberNickName(memberToken: MemberToken, param: MemberUpdateInformationParameterVM): Promise<Result<MemberInformationVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const memberInfoLibSvc = new MemberInformationLibSvc(memberToken.payload.mi, queryRunner)
            return memberInfoLibSvc.updateNickName(param)
        } catch (error) {
            queryRunner.rollbackTransaction();
            throw error
        } finally {
            queryRunner.release();
        }

    }

}


export const memberSvc = new MemberSvc();