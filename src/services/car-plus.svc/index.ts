import { QueryRunner } from 'typeorm';
import { CarPlusMemberInformation } from "@view-models/car-plus.vm";
import { Result } from "@view-models/common.vm";
import { dbProvider } from "@utilities";
import { CarPlusLibSvc } from "./lib/car-plus.lib.svc";
import { variableSvc } from '@services/variable.svc';

class CarPlusSvc {

    async getCarPlusMemberInformation(carPlusMemberId: string, queryRunner: QueryRunner): Promise<Result<CarPlusMemberInformation>> {
        const testRegex = variableSvc.getTesterRegExp();
        if (!testRegex.test(carPlusMemberId)) {
            const queryRunner = await dbProvider.createCarPlusTransactionQueryRunner()
            try {
                const carPlusLibSvc = new CarPlusLibSvc(queryRunner)
                const ret = await carPlusLibSvc.getCarPlusMemberInformation(carPlusMemberId)
                await queryRunner.commitTransaction();
                return ret;
            } catch (error) {
                await queryRunner.rollbackTransaction();
                throw error
            } finally {
                await queryRunner.release();
            }
        } else {
            const carPlusLibSvc = new CarPlusLibSvc(queryRunner)
            const ret = await carPlusLibSvc.getCarPlusMemberInformation(carPlusMemberId)
            return ret;
        }
    }

    async plusCarPlusPoint(carPlusMemberId: string, point: number, queryRunner: QueryRunner): Promise<Result<CarPlusMemberInformation>> {
        const testRegex = variableSvc.getTesterRegExp();

        if (!testRegex.test(carPlusMemberId)) {
            const queryRunner = await dbProvider.createCarPlusTransactionQueryRunner()
            try {
                const carPlusLibSvc = new CarPlusLibSvc(queryRunner)
                const ret = await carPlusLibSvc.plusCarPlusPoint(carPlusMemberId, point)
                await queryRunner.commitTransaction();
                return ret;
            } catch (error) {
                await queryRunner.rollbackTransaction();
                throw error
            } finally {
                await queryRunner.release();
            }
        } else {
            const carPlusLibSvc = new CarPlusLibSvc(queryRunner)
            const ret = await carPlusLibSvc.plusCarPlusPoint(carPlusMemberId, point)
            return ret;
        }


    }

    async minusCarPlusPoint(carPlusMemberId: string, point: number, queryRunner: QueryRunner): Promise<Result<CarPlusMemberInformation>> {

        const testRegex = variableSvc.getTesterRegExp();

        if (!testRegex.test(carPlusMemberId)) {

            const queryRunner = await dbProvider.createCarPlusTransactionQueryRunner()
            try {
                const carPlusLibSvc = new CarPlusLibSvc(queryRunner)
                const ret = await carPlusLibSvc.minusCarPlusPoint(carPlusMemberId, point)
                await queryRunner.commitTransaction();
                return ret;
            } catch (error) {
                await queryRunner.rollbackTransaction();
                throw error
            } finally {
                await queryRunner.release();
            }
        } else {
            const carPlusLibSvc = new CarPlusLibSvc(queryRunner)
            const ret = await carPlusLibSvc.minusCarPlusPoint(carPlusMemberId, point)
            return ret;
        }
    }
}


export const carPlusSvc = new CarPlusSvc();