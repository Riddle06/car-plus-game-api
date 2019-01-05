import { VariableLibSvc } from './lib/variable.lib.svc';
import { ListResult, Result } from "@view-models/common.vm";
import { LevelUpInformation } from "@view-models/variable.vm";
import { dbProvider } from "@utilities";

class VariableSvc {

    /**
     * 取得升級資訊
     */
    async getLevelInformation(): Promise<ListResult<LevelUpInformation>> {
        const queryRunner = await dbProvider.createQueryRunner();
        const variableLibSvc = new VariableLibSvc(queryRunner);
        return await variableLibSvc.getLevelInformation();
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

    async getHost(): Promise<Result<string>> {
        const queryRunner = await dbProvider.createQueryRunner();
        const variableLibSvc = new VariableLibSvc(queryRunner);
        return await variableLibSvc.getHost();
    }


    async getShareText(): Promise<Result<string>> {
        const queryRunner = await dbProvider.createQueryRunner();
        const variableLibSvc = new VariableLibSvc(queryRunner);
        return await variableLibSvc.getShareText();
    }



    getTesterRegExp(): RegExp {
        const testCarPlusIdRegex = /^test__\S+/;
        return testCarPlusIdRegex
    }

    getExperienceLimit(level: number, information: LevelUpInformation[]): number {
        const info = information.find(info => info.level === level + 1);
        if (info) { 
            return info.experience
        }

        return 0;
    }
}

export const variableSvc = new VariableSvc();