import { ListResult, Result } from "@view-models/common.vm";
import { LevelUpInformation } from "@view-models/variable.vm";

class VariableSvc {

    async getLevelInformation(): Promise<ListResult<LevelUpInformation>> {

        return null;
    }

    // 首次登入增送貨幣
    async getFirstLoginGiveGamePointAmount(): Promise<Result<number>> {
        const ret = new Result<number>();
        ret.item = 100;
        return ret.setResultValue(true);
    }

    /**
     * 每天可以購買格上紅利上限
     */
    async maxCarPlusPointAmountPerDay(): Promise<Result<number>> { 
        const ret = new Result<number>();
        ret.item = 1;
        return ret.setResultValue(true);
    }

}



export const variableSvc = new VariableSvc();