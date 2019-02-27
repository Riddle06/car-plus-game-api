import { AddAnalysisFields } from './../../view-models/operational-report.vm';
import { QueryRunner } from 'typeorm';
import { CarPlusMemberInformation } from "@view-models/car-plus.vm";
import { Result } from "@view-models/common.vm";
import { dbProvider } from "@utilities";
import { variableSvc } from '@services/variable.svc';
import { EventTriggerLibSvc } from './lib/event.trigger.lib.svc';

class EventTrigger {

    async addAnalysisFields(param: AddAnalysisFields): Promise<void> {
        const queryRunner = await dbProvider.createTransactionQueryRunner()
        try {
            const eventTriggerLibSvc = new EventTriggerLibSvc(queryRunner);
            const ret = await eventTriggerLibSvc.addAnalysisFields(param)
            await queryRunner.commitTransaction();
            return ret
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }
}


export const eventTrigger = new EventTrigger();