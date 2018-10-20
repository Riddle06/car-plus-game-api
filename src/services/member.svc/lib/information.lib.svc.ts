import { BaseConnection } from "@services/base-connection";
import { QueryRunner } from "typeorm";
import { Result, AppError } from "@view-models/common.vm";
import { MemberInformationVM, MemberUpdateInformationParameterVM } from "@view-models/member.vm";
import { MemberEntity } from "@entities/member.entity";
import { checker } from "@utilities";

export class MemberInformationLibSvc extends BaseConnection {

    private memberId: string = null
    constructor(memberId: string, queryRunner: QueryRunner) {
        super(queryRunner);
        this.memberId = memberId;
    }

    async getInformation(): Promise<Result<MemberInformationVM>> {
        const ret = new Result<MemberInformationVM>();



        return ret.setResultValue(true);
    }

    async updateNickName(param: MemberUpdateInformationParameterVM): Promise<Result<MemberInformationVM>> {

        const memberEntity = await this.entityManager.getRepository(MemberEntity).findOne(this.memberId)

        if (checker.isNullOrUndefinedObject(memberEntity)) {
            throw new AppError(`不存在此會員`);
        }

        await this.entityManager.getRepository(MemberEntity).update({ id: this.memberId }, {
            ...param
        })

        return this.getInformation();
    }



}