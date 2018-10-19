import { BaseConnection } from '../../base-connection';
import { BaseResult } from '@view-models/common.vm';
import { VarsEntity } from '@entities/vars.entity';
export class Vars extends BaseConnection {

    async test(): Promise<BaseResult> {
        await this.queryRunner.manager.getRepository(VarsEntity).insert({
            key: 'test',
            description: 'test_description',
            metaInt1: 1,
            metaInt2: 0
        })
        return new BaseResult(true);
    }

}