import { ResultCode, Result } from './../../../view-models/common.vm';
import { AppError } from '@view-models/common.vm';
import { checker } from './../../../utilities/type-checker/index';
import { BaseConnection } from '@services/base-connection';
import { LevelUpInformation } from '@view-models/variable.vm';
import { ListResult } from '@view-models/common.vm';
import { VarsEntity } from '@entities/vars.entity';
export class VariableLibSvc extends BaseConnection {
    async getLevelInformation(): Promise<ListResult<LevelUpInformation>> {
        const ret = new ListResult<LevelUpInformation>()

        const varsEntity = await this.entityManager.getRepository(VarsEntity).findOne({
            key: 'level-up-information'
        });

        if (checker.isNullOrUndefinedObject(varsEntity)) {
            throw new AppError('查無升級參數', ResultCode.serverError);
        }

        ret.items = JSON.parse(varsEntity.metaStrLong);

        return ret.setResultValue(true);
    }

    async getHost(): Promise<Result<string>> {
        const ret = new Result<string>()

        const varsEntity = await this.entityManager.getRepository(VarsEntity).findOne({
            key: 'host'
        });

        if (checker.isNullOrUndefinedObject(varsEntity)) {
            throw new AppError('查無host參數', ResultCode.serverError);
        }

        ret.item = varsEntity.metaStr1;

        return ret.setResultValue(true);
    }


    async getShareText(): Promise<Result<string>> {
        const ret = new Result<string>()

        const varsEntity = await this.entityManager.getRepository(VarsEntity).findOne({
            key: 'share-text'
        });

        if (checker.isNullOrUndefinedObject(varsEntity)) {
            throw new AppError('查無分享文案參數', ResultCode.serverError);
        }

        const hostRet = await this.getHost();


        ret.item = varsEntity.metaStr1.replace(/{{host}}/g, hostRet.item);

        return ret.setResultValue(true);
    }


}