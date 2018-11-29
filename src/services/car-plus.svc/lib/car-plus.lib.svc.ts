import { AppError } from '@view-models/common.vm';
import { variableSvc } from '@services/variable.svc';
import { BaseConnection } from "@services/base-connection";
import { CarPlusMemberInformation } from "@view-models/car-plus.vm";
import { Result } from "@view-models/common.vm";
import * as luxon from "luxon";

export class CarPlusLibSvc extends BaseConnection {
    async getCarPlusMemberInformation(carPlusMemberId: string): Promise<Result<CarPlusMemberInformation>> {
        const ret = new Result<CarPlusMemberInformation>();

        const testRegex = variableSvc.getTesterRegExp();

        if (!testRegex.test(carPlusMemberId)) {
            const queryRet: { msg: string, id: string, bonus: number }[] = await this.entityManager.query('execute s_customer_R2 ?', [carPlusMemberId]);

            if (queryRet.length === 0) {
                throw new AppError(`查無資料 carPlusMemberId: ${carPlusMemberId}`)
            }

            if (queryRet[0].msg === "error") {
                throw new AppError(`此ID無效，並無此會員 carPlusMemberId: ${carPlusMemberId}`)
            }

            ret.item = {
                carPlusPoint: queryRet[0].bonus,
                dateCreated: luxon.DateTime.fromFormat("2017-01-10 10:00:00", "YYYY-MM-DD HH:mm:ss").toJSDate(),
                id: carPlusMemberId
            }

        } else {

            ret.item = {
                carPlusPoint: 0,
                dateCreated: luxon.DateTime.fromFormat("2017-01-10 10:00:00", "YYYY-MM-DD HH:mm:ss").toJSDate(),
                id: carPlusMemberId
            }
        }

        return ret.setResultValue(true)
    }

    /**
     * 增加格上紅利
     */
    async plusCarPlusPoint(carPlusMemberId: string, point: number): Promise<Result<CarPlusMemberInformation>> {

        const testRegex = variableSvc.getTesterRegExp();
        if (testRegex.test(carPlusMemberId)) { 
            return this.getCarPlusMemberInformation(carPlusMemberId)
        }

        const queryRet: { msg: string }[] = await this.entityManager.query(`execute s_Customer_I1 ?, ?, ?`, [carPlusMemberId, point, '會員小遊戲'])

        if (queryRet.length === 0) {
            throw new AppError('使用格上紅利 資料回傳錯誤')
        }

        if (queryRet[0].msg === "error") {
            throw new AppError('使用格上紅利 此ID無效，並無此會員')
        }

        if (queryRet[0].msg === "noPoint") {
            throw new AppError('使用的點數小於0')
        }


        return this.getCarPlusMemberInformation(carPlusMemberId)
    }

    /**
     * 使用格上紅利
     */
    async minusCarPlusPoint(carPlusMemberId: string, point: number): Promise<Result<CarPlusMemberInformation>> {

        const testRegex = variableSvc.getTesterRegExp();
        if (testRegex.test(carPlusMemberId)) { 
            return this.getCarPlusMemberInformation(carPlusMemberId)
        }

        const queryRet: { msg: string }[] = await this.entityManager.query(`execute s_Customer_I2  ?, ?, ?`, [carPlusMemberId, point, '會員小遊戲'])

        if (queryRet.length === 0) {
            throw new AppError('使用格上紅利 資料回傳錯誤')
        }

        if (queryRet[0].msg === "error") {
            throw new AppError('使用格上紅利 此ID無效，並無此會員')
        }

        if (queryRet[0].msg === "noPoint") {
            throw new AppError('使用的點數小於0')
        }

        if (queryRet[0].msg === "紅利點數不足") {
            throw new AppError('紅利點數不足')
        }

        return this.getCarPlusMemberInformation(carPlusMemberId)

    }
}