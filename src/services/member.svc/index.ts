import { QueryRunner } from 'typeorm';
import { MemberInformationVM, MemberUpdateInformationParameterVM, MemberLoginCreateParameterVM } from "@view-models/member.vm";
import { Result } from "@view-models/common.vm";
import { dbProvider } from "@utilities";
import { MemberInformationLibSvc } from "./lib/information.lib.svc";
import { MemberToken } from "@view-models/verification.vm";
import { MemberLoginLibSvc } from './lib/member.login.svc';
import { RegisterLibSvc } from './lib/register.lib.svc';


class MemberSvc {

    async createMemberLogin(param: MemberLoginCreateParameterVM): Promise<Result<string>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const registerLibSvc = new RegisterLibSvc(queryRunner)
            const memberLoginLibSvc = new MemberLoginLibSvc(queryRunner, registerLibSvc)
            const ret = await memberLoginLibSvc.create(param)
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }


    async getMemberInformation(memberToken: MemberToken): Promise<Result<MemberInformationVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const memberInfoLibSvc = new MemberInformationLibSvc(memberToken.payload.mi, queryRunner)
            const ret = await memberInfoLibSvc.getInformation()
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }

    }

    async getMemberInformationByMemberId(memberId: string, queryRunner: QueryRunner): Promise<Result<MemberInformationVM>> {
        const memberInfoLibSvc = new MemberInformationLibSvc(memberId, queryRunner)
        const ret = await memberInfoLibSvc.getInformation()
        return ret;
    }

    async updateMemberNickName(memberToken: MemberToken, param: MemberUpdateInformationParameterVM): Promise<Result<MemberInformationVM>> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const memberInfoLibSvc = new MemberInformationLibSvc(memberToken.payload.mi, queryRunner)
            const ret = await memberInfoLibSvc.updateNickName(param)
            await queryRunner.commitTransaction();
            return ret;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }
    async handleEmptyShortIdMembers(): Promise<void> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const registerLibSvc = new RegisterLibSvc(queryRunner)
            await registerLibSvc.handleEmptyShortIdMembers()
            await queryRunner.commitTransaction();
            return;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }
}


export const memberSvc = new MemberSvc();