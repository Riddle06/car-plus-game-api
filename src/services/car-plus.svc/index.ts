import { CarPlusMemberInformation } from "@view-models/car-plus.vm";
import { Result } from "@view-models/common.vm";

class CarPlusSvc {

    async getCarPlusMemberInformation(carPlusMemberId: string): Promise<Result<CarPlusMemberInformation>> {
        return null;
    }

    async plusCarPlusPoint(carPlusMemberId: string, point: number):Promise<Result<CarPlusMemberInformation>> {
        return null;
    }
}


export const carPlusSvc = new CarPlusSvc();