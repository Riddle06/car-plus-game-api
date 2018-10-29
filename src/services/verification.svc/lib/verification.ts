import { MemberLoginEntity } from './../../../entities/member-login.entity';
import { BaseConnection } from "@services/base-connection";
import { BaseResult, ResultCode, AppError, Result } from "view-models/common.vm";
import * as jwt from "jsonwebtoken";
import { configurations } from "@configuration";
import { MemberToken } from "@view-models/verification.vm";
import * as luxon from "luxon";
import { Not } from 'typeorm';
import { memberSvc } from '@services/member.svc';

class Verification extends BaseConnection {

   
    async verifyToken(token: string): Promise<BaseResult> {
        const ret = new BaseResult(false);

        try {
            jwt.verify(token, configurations.token.securityKey);
        } catch (error) {
            throw new AppError(`金鑰驗證錯誤(1)`, ResultCode.clientError)
        }

        const tokenVM = jwt.decode(token, { complete: true }) as MemberToken;

        if (luxon.DateTime.local() > luxon.DateTime.fromMillis(tokenVM.payload.exp)) {
            await this.logout(tokenVM.payload.mi);
            throw new AppError(`金鑰過期(2)`, ResultCode.clientError)
        }

        // check this client id



        return ret.setResultValue(true, ResultCode.success)
    }

    private async logout(memberId: string): Promise<BaseResult> {
        const ret = new BaseResult(false);

        await this.queryRunner.manager
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

