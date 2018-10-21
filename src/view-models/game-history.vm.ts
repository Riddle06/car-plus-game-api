import { GameToolItemVM } from "./game.vm";

export enum HistoryType {
    game = "game",
    carPlusPointTransferToGamePoint = "car_plus_point_transfer_to_game_point",
    gamePointTransferToCarPlusPoint = "game_point_transfer_to_car_plus_point",
    gamePointTransferToGameItem = "game_point_transfer_to_game_item"

}

export interface PointHistoryVM {
    id: string
    type: HistoryType
    dateCreated: Date
    description: string
    gameItemId?: string
    gameItemMemberId?: string
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
    usedItems: GameToolItemVM[]
    dateCreated: string
    dateFinish: Date
}