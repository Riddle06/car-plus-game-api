import { ResultCode } from '@view-models/common.vm';
import { AdminUserEntity } from '@entities/admin-user.entity';
import { AdminUserLoginParameterVM, AdminUserTokenPayload, AdminUserTokenHeader } from '@view-models/admin.auth.vm';
import { BaseConnection } from '@services/base-connection';
import { Result, AppError } from '@view-models/common.vm';
import { checker, encrypt } from '@utilities';
import * as luxon from "luxon";
import * as jwt from "jsonwebtoken";
import { configurations } from '@configuration';
export class LoginLibSvc extends BaseConnection {

    async login(clientId: string, param: AdminUserLoginParameterVM): Promise<Result<string>> {
        const { account, password } = param

        if (checker.isNullOrUndefinedObject(account) || checker.isNullOrUndefinedObject(password)) {
            throw new AppError('請輸入帳號密碼', ResultCode.clientError)
        }


        const adminUserRepository = await this.entityManager.getRepository(AdminUserEntity);

        const adminUser = await adminUserRepository.findOne({
            where: {
                account
            }
        })

        if (checker.isNullOrUndefinedObject(adminUser)) {
            throw new AppError('此帳號不存在', ResultCode.clientError)
        }

        if (adminUser.password !== encrypt.sha256Hash(password)) {
            throw new AppError('密碼驗證錯誤', ResultCode.clientError)
        }
        
        const ret = new Result<string>(true);

        ret.item = this.generateToken(clientId, adminUser)

        return ret;
    }

    private generateToken(clientId: string, adminUser: AdminUserEntity): string {

        const tokenPayload: AdminUserTokenPayload = {
            ci: clientId,
            id: adminUser.id,
            exp: luxon.DateTime.local().plus({ years: 200 }).toMillis(),
            iat: (new Date()).getTime(),
            iss: 'car-plus-game',
        }

        const tokenHeader: AdminUserTokenHeader = {
            alg: "HS256",
            typ: "JWT"
        };

        const signature = jwt.sign(tokenPayload, configurations.token.securityKey, { header: tokenHeader })

        return signature
    }

}