import { configurations } from './../../configuration/index';
import { Vars } from './lib/vars';
import { BaseResult } from "@view-models/common.vm";
import { getManager, QueryRunner } from 'typeorm';
import { dbProvider } from '@utilities';
class TestSvc {

    async test(): Promise<BaseResult> {
        const queryRunner = await dbProvider.createTransactionQueryRunner();

        const vars = new Vars(queryRunner);
        try {
            await vars.test()
            await queryRunner.commitTransaction();
        } catch (error) {
            console.log(`error`, error)
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }



        return new BaseResult(true);
    }


    async testJoinAndSelect(): Promise<BaseResult> {
        const queryRunner = await dbProvider.createTransactionQueryRunner();

        const vars = new Vars(queryRunner);
        try {
            await vars.testJoinConditionAndSelect()
            await queryRunner.commitTransaction();
        } catch (error) {
            console.log(`error`, error)
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }



        return new BaseResult(true);
    }


    async testInsert(): Promise<BaseResult> {
        const queryRunner = await dbProvider.createTransactionQueryRunner();

        const vars = new Vars(queryRunner);
        try {
            await vars.testInsert()
            await queryRunner.commitTransaction();
        } catch (error) {
            console.log(`error`, error)
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }



        return new BaseResult(true);
    }

    async testAddAmount(): Promise<BaseResult> {
        const queryRunner = await dbProvider.createTransactionQueryRunner();

        const vars = new Vars(queryRunner);
        try {
            await vars.testAddAmountMetaInt1Amount()
            await queryRunner.commitTransaction();
        } catch (error) {
            console.log(`error`, error)
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }

        return new BaseResult(true);
    }

}

export const testSvc = new TestSvc();
