import { GameOperationalReportEntity } from './../../../entities/game-operational-report.entity';
import { BaseConnection } from "@services/base-connection";
import { AddAnalysisFields } from "@view-models/operational-report.vm";
import * as luxon from "luxon";
import { checker } from '@utilities';

export class EventTriggerLibSvc extends BaseConnection {
    async addAnalysisFields(param: AddAnalysisFields): Promise<void> {
        const entity = await this.getGameOperationalReport();
        const setDic: Partial<{ [key: string]: any }> = {};
        const values: AddAnalysisFields = {};
        const dateRecord = this.getCurrentDateRecord();

        if (!checker.isNullOrUndefinedObject(param.loginTimes)) {
            setDic.loginTimes = () => "login_times + :loginTimes";
            values.loginTimes = param.loginTimes
        }
        if (!checker.isNullOrUndefinedObject(param.gameTimes)) {
            setDic.gameTimes = () => "game_times + :gameTimes";
            values.gameTimes = param.gameTimes
        }
        if (!checker.isNullOrUndefinedObject(param.catchGameTimes)) {
            setDic.catchGameTimes = () => "catch_game_times + :catchGameTimes";
            values.catchGameTimes = param.catchGameTimes
        }
        if (!checker.isNullOrUndefinedObject(param.catchGameScore)) {
            setDic.catchGameScore = () => "catch_game_score + :catchGameScore";
            values.catchGameScore = param.catchGameScore
        }
        if (!checker.isNullOrUndefinedObject(param.catchGamePoint)) {
            setDic.catchGamePoint = () => "catch_game_point + :catchGamePoint";
            values.catchGamePoint = param.catchGamePoint
        }
        if (!checker.isNullOrUndefinedObject(param.shotGameTimes)) {
            setDic.shotGameTimes = () => "shot_game_times + :shotGameTimes";
            values.shotGameTimes = param.shotGameTimes
        }
        if (!checker.isNullOrUndefinedObject(param.shotGameScore)) {
            setDic.shotGameScore = () => "shot_game_score + :shotGameScore";
            values.shotGameScore = param.shotGameScore
        }
        if (!checker.isNullOrUndefinedObject(param.costGamePoint)) {
            setDic.costGamePoint = () => "cost_game_point + :costGamePoint";
            values.costGamePoint = param.costGamePoint
        }
        if (!checker.isNullOrUndefinedObject(param.costCarPlusPoint)) {
            setDic.costCarPlusPoint = () => "cost_car_plus_point + :costCarPlusPoint";
            values.costCarPlusPoint = param.costCarPlusPoint
        }

        await this.entityManager.createQueryBuilder().update(GameOperationalReportEntity)
            .set(setDic)
            .where({
                dateRecord
            })
            .setParameters(values)

        return;
    }

    async getGameOperationalReport(): Promise<GameOperationalReportEntity> {
        const dateRecord = this.getCurrentDateRecord();
        const gameOperationalReportRepository = this.entityManager.getRepository(GameOperationalReportEntity);
        let entity = await gameOperationalReportRepository.findOne({
            where: {
                dateRecord
            }
        });

        if (!checker.isNullOrUndefinedObject(entity)) {
            return entity;
        }

        entity = new GameOperationalReportEntity()
        entity.dateRecord = dateRecord;
        entity.loginTimes = 0;
        entity.gameTimes = 0;
        entity.catchGameTimes = 0;
        entity.catchGameScore = 0;
        entity.catchGamePoint = 0;
        entity.shotGameTimes = 0;
        entity.shotGameScore = 0;
        entity.costGamePoint = 0;
        entity.costCarPlusPoint = 0;

        await gameOperationalReportRepository.insert(entity);
        return entity;
    }
    private getCurrentDateRecord(): Date {
        const recordDate = luxon.DateTime.local().startOf('day').toJSDate();
        return recordDate;
    }
}