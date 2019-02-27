export type AddAnalysisFields = Partial<AnalysisFields>

export interface OperationalReportQueryParameter {
    dateStart: Date
    dateEnd: Date
}

export interface OperationalReportItem extends AnalysisFields {
    dateRecord: Date
    loginAndGameTimesRate: number
}

export interface AnalysisFields {
    loginTimes: number
    gameTimes: number
    catchGameTimes: number
    catchGameScore: number
    catchGamePoint: number
    shotGameTimes: number
    shotGameScore: number
    costGamePoint: number
    costCarPlusPoint: number
}