import { MemberLoginEntity } from './../../../entities/member-login.entity';
import { BaseConnection } from "@services/base-connection";
import { BaseResult, ResultCode, AppError, Result } from "@view-models/common.vm";
import { configurations } from "@configuration";
import { MemberToken } from "@view-models/verification.vm";
import { checker } from '@utilities';
import * as jwt from "jsonwebtoken";
import * as luxon from "luxon";

export class VerificationLibSvc extends BaseConnection {

    async verifyToken(token: string): Promise<Result<MemberToken>> {
        const ret = new Result<MemberToken>(false)

        try {
            jwt.verify(token, configurations.token.securityKey);
        } catch (error) {
            throw new AppError(`金鑰驗證錯誤(1)`, ResultCode.accessTokenExpired)
        }

        const tokenVM = jwt.decode(token, { complete: true }) as MemberToken;

        if (luxon.DateTime.local() > luxon.DateTime.fromMillis(tokenVM.payload.exp)) {
            await this.logout(tokenVM.payload.mi);
            throw new AppError(`金鑰過期(2)`, ResultCode.accessTokenExpired)
        }

        const memberLoginRepository = await this.entityManager.getRepository(MemberLoginEntity);

        const memberLoginEntity = await memberLoginRepository.findOne({
            memberId: tokenVM.payload.mi,
            clientId: tokenVM.payload.ci
        })

        if (checker.isNullOrUndefinedObject(memberLoginEntity)) {
            throw new AppError(`查無登入紀錄`)
        }

        if (memberLoginEntity.isLogout) {
            throw new AppError(`此裝置已被登出`)
        }

        ret.item = tokenVM;

        return ret.setResultValue(true, ResultCode.success)
    }

    private async logout(memberId: string): Promise<BaseResult> {
        const ret = new BaseResult(false);

        await this.entityManager
            .getRepository<MemberLoginEntity>(MemberLoginEntity)
            .update({
                isLogout: false, memberId
            }, {
                    isLogout: true,
                    dateLastLogout: luxon.DateTime.local().toJSDate()
                });

        return ret.setResultValue(true, ResultCode.success)
    }
}

