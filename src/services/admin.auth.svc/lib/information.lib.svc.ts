import { AppError } from '@view-models/common.vm';
import { AdminUserEntity } from './../../../entities/admin-user.entity';
import { BaseConnection } from '@services/base-connection';
import { Result } from '@view-models/common.vm';
import { AdminUserVM } from '@view-models/admin.auth.vm';
import { checker } from '@utilities';
export class AdminInformationLibSvc extends BaseConnection {

    async getProfile(adminUserId: string): Promise<Result<AdminUserVM>> {
        const adminUserEntity = await this.entityManager.getRepository(AdminUserEntity).findOne(adminUserId);

        if (checker.isNullOrUndefinedObject(adminUserEntity)) {
            throw new AppError('此帳號不存在')
        }

        const ret = new Result<AdminUserVM>(true);
        const { account, name, id, dateCreated } = adminUserEntity
        ret.item = {
            account,
            dateCreated,
            id,
            name
        }

        return ret;
    }
}