export type AddAnalysisFields = Partial<AnalysisFields>

export interface OperationalReportQueryParameter {
    dateStart: Date
    dateEnd: Date
}

export interface OperationalReportItemVM extends AnalysisFields {
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
    shotGamePoint: number
    costGamePoint: number
    costCarPlusPoint: number
}