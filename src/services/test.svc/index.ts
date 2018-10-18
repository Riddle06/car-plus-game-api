import { configurations } from './../../configuration/index';
import { Vars } from './lib/vars';
import { BaseResult } from "@view-models/common.vm";
import { connection } from "@utilities";
import { getManager } from 'typeorm';


class TestSvc {

    async test(): Promise<BaseResult> {

        const conn = await connection;
        const manager = await getManager(configurations.db.connectionName);

        manager.transaction(async (entity) => {
            const vars = new Vars(entity);

            await vars.test();
        })

        return new BaseResult(true);
    }

}

export const testSvc = new TestSvc();
