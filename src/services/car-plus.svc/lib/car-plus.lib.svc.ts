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
            // TODO: call procedure
            throw new AppError('目前還尚未有串接會員功能')
        }

        

        ret.item = {
            carPlusPoint: 0,
            dateCreated: luxon.DateTime.fromFormat("2017-01-10 10:00:00", "YYYY-MM-DD HH:mm:ss").toJSDate(),
            id: carPlusMemberId
        }

        return ret.setResultValue(true)
    }

    async plusCarPlusPoint(carPlusMemberId: string, point: number): Promise<Result<CarPlusMemberInformation>> {
        const ret = new Result<CarPlusMemberInformation>();

        // TODO: call procedure

        ret.item = {
            carPlusPoint: 0,
            dateCreated: luxon.DateTime.fromFormat("2017-01-10 10:00:00", "YYYY-MM-DD HH:mm:ss").toJSDate(),
            id: carPlusMemberId
        }

        return ret.setResultValue(true)
    }
}