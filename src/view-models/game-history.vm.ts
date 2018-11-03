import { GameItemVM } from "./game.vm";

export enum PointHistoryType {
    game = 1,
    carPlusPointTransferToGamePoint = 2,
    gamePointTransferToCarPlusPoint = 3,
    gamePointTransferToGameItem = 4

}

export interface PointHistoryVM {
    id: string
    type: PointHistoryType
    dateCreated: Date
    description: string
    gameItemId?: string
    memberGameItemId?: string
    beforeGamePoint: number;
    afterGamePoint: number;
    changeGamePoint: number;
    beforeCarPlusPoint: number
    afterCarPlusPoint: number
    changeCarPlusPoint: number
}

export interface PlayGameParameterVM {
    gameId: string
}

export interface ReportPlayGameParameterVM {
    gameHistoryId: string
    scoreEncryptString: string
}

export interface StartGameHistoryVM {
    id: string
    gameId: string
    gameParameters: {}
    usedItems: GameItemVM[]
    dateCreated: string
    dateFinish: Date
}