import { CarPlusMemberInformation } from "@view-models/car-plus.vm";
import { Result } from "@view-models/common.vm";
import { dbProvider } from "@utilities";
import { CarPlusLibSvc } from "./lib/car-plus.lib.svc";

class CarPlusSvc {

    async getCarPlusMemberInformation(carPlusMemberId: string): Promise<Result<CarPlusMemberInformation>> {
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
    }

    async plusCarPlusPoint(carPlusMemberId: string, point: number):Promise<Result<CarPlusMemberInformation>> {
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
    }

    async minusCarPlusPoint(carPlusMemberId: string, point: number):Promise<Result<CarPlusMemberInformation>> {
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
    }
}


export const carPlusSvc = new CarPlusSvc();