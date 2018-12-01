import { BaseConnection } from '@services/base-connection';
import { AdminUserToken } from '@view-models/admin.auth.vm';
import { Result, AppError, ResultCode } from '@view-models/common.vm';
import * as jwt from "jsonwebtoken";
import { configurations } from '@configuration';
import * as luxon from "luxon";
import { checker } from '@utilities';
export class VerificationLibSvc extends BaseConnection {

    async verify(path: string, token: string): Promise<Result<AdminUserToken>> {

        const ignorePaths: string[] = ['/login']

        if (configurations.app.env === "dev" && checker.isNullOrUndefinedOrWhiteSpace(token)) {
            console.log(`not admin login token`)
            return new Result(true)
        }

        if (ignorePaths.some(ignorePath => path === ignorePath)) {
            return new Result(true)
        }


        try {
            jwt.verify(token, configurations.token.securityKey);
        } catch (error) {
            throw new AppError(`金鑰驗證錯誤(1)`, ResultCode.accessTokenExpired)
        }

        const tokenVM = jwt.decode(token, { complete: true }) as AdminUserToken;

        if (luxon.DateTime.local() > luxon.DateTime.fromMillis(tokenVM.payload.exp)) {
            throw new AppError(`金鑰過期(2)`, ResultCode.accessTokenExpired)
        }

        const ret = new Result<AdminUserToken>(true)
        ret.item = tokenVM;

        return ret
    }

}