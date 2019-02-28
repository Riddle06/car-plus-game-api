import { MemberGameHistoryEntity } from '@entities/member-game-history.entity';
import { MemberLoginDailyHistory } from './../../../entities/member-login-daily-history.entity';
import { BaseConnection } from '@services/base-connection';
import { Result, PageQuery, ListResult } from '@view-models/common.vm';
import { AdminGameDashboardVM } from '@view-models/admin.game.vm';
import { ExportResult, exporter } from '@utilities/exporter';
import { checker } from '@utilities';
import { OperationalReportItemVM } from '@view-models/operational-report.vm';
import * as luxon from "luxon";
import { GameOperationalReportEntity } from '@entities/game-operational-report.entity';
import { Between } from 'typeorm';


export class AdminGameDashboardLibSvc extends BaseConnection {
    async getGameDashboard(params: PageQuery): Promise<ListResult<OperationalReportItemVM>> {
        const ret = new ListResult<OperationalReportItemVM>(true);

        // 預設七天
        if (!checker.isDate(params.listQueryParam.dateStart) && !checker.isDate(params.listQueryParam.dateEnd)) {
            params.listQueryParam.dateStart = luxon.DateTime.local().minus({
                days: 7
            }).startOf('day').toJSDate();
            params.listQueryParam.dateEnd = luxon.DateTime.local().endOf('day').toJSDate();
        }

        if (!checker.isDate(params.listQueryParam.dateStart)) {
            params.listQueryParam.dateStart = luxon.DateTime.fromJSDate(params.listQueryParam.dateEnd).minus({
                days: 7
            }).startOf('day').toJSDate();
        }

        if (!checker.isDate(params.listQueryParam.dateEnd)) {
            params.listQueryParam.dateEnd = luxon.DateTime.fromJSDate(params.listQueryParam.dateStart).plus({
                days: 7
            }).endOf('day').toJSDate();
        }

        params.listQueryParam.dateStart = luxon.DateTime.fromJSDate(params.listQueryParam.dateStart).startOf('day').toJSDate();
        params.listQueryParam.dateEnd = luxon.DateTime.fromJSDate(params.listQueryParam.dateEnd).endOf('day').toJSDate();

        const operationalReportRepository = await this.entityManager.getRepository(GameOperationalReportEntity);

        const entities = await operationalReportRepository.find({
            where: {
                dateRecord: Between(params.listQueryParam.dateStart, luxon.DateTime.fromJSDate(params.listQueryParam.dateEnd).minus({ minutes: 1 }).toJSDate())
            }
        })

        ret.items = [];

        let luxonCurrentDateRecord = luxon.DateTime.fromJSDate(params.listQueryParam.dateStart).startOf('day');
        const luxonDateEnd = luxon.DateTime.fromJSDate(params.listQueryParam.dateEnd)
        while (luxonCurrentDateRecord <= luxonDateEnd) {

            const currentEntity = entities.find(entity => {
                return luxon.DateTime.fromJSDate(entity.dateRecord).toFormat("yyyy/MM/dd") === luxonCurrentDateRecord.toFormat("yyyy/MM/dd")
            })

            const item: OperationalReportItemVM = {
                dateRecord: luxonCurrentDateRecord.toJSDate(),
                loginAndGameTimesRate: 0,
                loginTimes: 0,
                gameTimes: 0,
                catchGameTimes: 0,
                catchGameScore: 0,
                catchGamePoint: 0,
                shotGameTimes: 0,
                shotGameScore: 0,
                shotGamePoint: 0,
                costGamePoint: 0,
                costCarPlusPoint: 0
            }

            if (!checker.isNullOrUndefinedObject(currentEntity)) {
                item.loginTimes = currentEntity.loginTimes;
                item.gameTimes = currentEntity.gameTimes;
                item.catchGameTimes = currentEntity.catchGameTimes;
                item.catchGameScore = currentEntity.catchGameScore;
                item.catchGamePoint = currentEntity.catchGamePoint;
                item.shotGameTimes = currentEntity.shotGameTimes;
                item.shotGameScore = currentEntity.shotGameScore;
                item.shotGamePoint = currentEntity.shotGamePoint;
                item.costGamePoint = currentEntity.costGamePoint;
                item.costCarPlusPoint = currentEntity.costCarPlusPoint;
                if (item.loginTimes > 0) {
                    item.loginAndGameTimesRate = parseFloat((item.gameTimes / item.loginTimes).toFixed(2))
                }
            }

            ret.items.push(item);

            luxonCurrentDateRecord = luxonCurrentDateRecord.plus({
                days: 1
            }).startOf('day');
        }




        return ret;
    }

    async exportGameDashboard(params: PageQuery): Promise<ExportResult> {

        const gameDashboardResult = await this.getGameDashboard(params);
        const data = gameDashboardResult.items;

        return exporter.exportByFieldDicAndData({
            data,
            fieldNameDic: {
                dateRecord: "天次",
                loginTimes: "登入人次",
                gameTimes: "遊戲場次",
                loginAndGameTimesRate: "平均遊戲場數(場次/人次)",
                catchGameTimes: "超人接接樂場數",
                catchGameScore: "超人接接樂獲得分數",
                catchGamePoint: "超人接接樂獲得超人幣",
                shotGameTimes: "射擊吧超人場數",
                shotGameScore: "射擊吧超人獲得分數",
                shotGamePoint: "射擊吧超人獲得超人幣",
                costGamePoint: "超人幣消費量",
                costCarPlusPoint: "格上紅利消費量",
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