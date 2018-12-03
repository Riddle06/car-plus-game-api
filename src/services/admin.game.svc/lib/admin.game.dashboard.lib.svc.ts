import { MemberGameHistoryEntity } from '@entities/member-game-history.entity';
import { MemberLoginDailyHistory } from './../../../entities/member-login-daily-history.entity';
import { BaseConnection } from '@services/base-connection';
import { Result, PageQuery } from '@view-models/common.vm';
import { AdminGameDashboardVM } from '@view-models/admin.game.vm';
import { ExportResult, exporter } from '@utilities/exporter';
import { checker } from '@utilities';


export class AdminGameDashboardLibSvc extends BaseConnection {
    async getGameDashboard(params: PageQuery): Promise<Result<AdminGameDashboardVM>> {
        console.log(`params`, params)
        const ret = new Result<AdminGameDashboardVM>(true);
        ret.item = {
            memberCount: await this.getMemberCount(params),
            gameCount: await this.getGameCount(params),
            memberHasPlayGameCount: await this.getMemberHasPlayGameCount(params)
        }

        return ret;
    }

    async exportGameDashboard(params: PageQuery): Promise<ExportResult> {

        const data: AdminGameDashboardVM[] = [{
            memberCount: await this.getMemberCount(params),
            gameCount: await this.getGameCount(params),
            memberHasPlayGameCount: await this.getMemberHasPlayGameCount(params)
        }]

        return exporter.exportByFieldDicAndData({
            data,
            fieldNameDic: {
                memberCount: "登入人次",
                gameCount: "遊戲場次",
                memberHasPlayGameCount: "總遊戲人次"
            },
            fileName: "營運報表",
            sheetName: "sheet1"
        })
    }

    private async getMemberCount(param: PageQuery): Promise<number> {
        const conditions: string[] = ['1 = 1'];
        const parameters: any = {};

        if (checker.isDate(param.listQueryParam.dateEnd) && checker.isDate(param.listQueryParam.dateStart)) {
            conditions.push(`memberLoginDailyHistory.date_record between :dateStart and :dateEnd`);
            parameters.dateStart = param.listQueryParam.dateStart
            parameters.dateEnd = param.listQueryParam.dateEnd
        } else if (checker.isDate(param.listQueryParam.dateStart)) {
            conditions.push(`memberLoginDailyHistory.date_record >= :dateStart`);
            parameters.dateStart = param.listQueryParam.dateStart;
        } else if (checker.isDate(param.listQueryParam.dateEnd)) {
            conditions.push(`memberLoginDailyHistory.date_record >= :dateEnd`);
            parameters.dateEnd = param.listQueryParam.dateEnd
        }

        const countRet: { count: number } = await this.entityManager
            .createQueryBuilder(MemberLoginDailyHistory, 'memberLoginDailyHistory')
            .select('count(*)', 'count')
            .where(conditions.join(' and '))
            .setParameters(parameters)
            .getRawOne()

        return countRet ? countRet.count : 0
    }

    private async getGameCount(param: PageQuery): Promise<number> {
        const conditions: string[] = ['1 = 1', 'date_finished is not null'];
        const parameters: any = {};

        if (checker.isDate(param.listQueryParam.dateEnd) && checker.isDate(param.listQueryParam.dateStart)) {
            conditions.push(`memberGameHistory.date_created between :dateStart and :dateEnd`);
            parameters.dateStart = param.listQueryParam.dateStart
            parameters.dateEnd = param.listQueryParam.dateEnd
        } else if (checker.isDate(param.listQueryParam.dateStart)) {
            conditions.push(`memberGameHistory.date_created >= :dateStart`);
            parameters.dateStart = param.listQueryParam.dateStart;
        } else if (checker.isDate(param.listQueryParam.dateEnd)) {
            conditions.push(`memberGameHistory.date_created >= :dateEnd`);
            parameters.dateEnd = param.listQueryParam.dateEnd
        }

        const countRet: { count: number } = await this.entityManager
            .createQueryBuilder(MemberGameHistoryEntity, 'memberGameHistory')
            .select('count(*)', 'count')
            .where(conditions.join(' and '))
            .setParameters(parameters)
            .getRawOne()

        return countRet ? countRet.count : 0
    }

    private async getMemberHasPlayGameCount(param: PageQuery): Promise<number> {
        const conditions: string[] = ['1 = 1', 'date_finished is not null'];
        const parameters: any = {};

        if (checker.isDate(param.listQueryParam.dateEnd) && checker.isDate(param.listQueryParam.dateStart)) {
            conditions.push(`memberGameHistory.date_created between :dateStart and :dateEnd`);
            parameters.dateStart = param.listQueryParam.dateStart
            parameters.dateEnd = param.listQueryParam.dateEnd
        } else if (checker.isDate(param.listQueryParam.dateStart)) {
            conditions.push(`memberGameHistory.date_created >= :dateStart`);
            parameters.dateStart = param.listQueryParam.dateStart;
        } else if (checker.isDate(param.listQueryParam.dateEnd)) {
            conditions.push(`memberGameHistory.date_created >= :dateEnd`);
            parameters.dateEnd = param.listQueryParam.dateEnd
        }

        const count = await this.entityManager
            .createQueryBuilder(MemberGameHistoryEntity, 'memberGameHistory')
            .select('count(memberGameHistory.member_id)', 'count')
            .addSelect('memberGameHistory.member_id', 'memberId')
            .where(conditions.join(' and '))
            .groupBy('memberGameHistory.member_id')
            .setParameters(parameters)
            .getCount()

        return count;
    }
}