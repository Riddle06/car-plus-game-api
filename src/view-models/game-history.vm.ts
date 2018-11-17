import { GameItemVM } from "./game.vm";

export enum PointHistoryType {
    /**
     * 遊戲獲得
     */
    game = 1,
    /**
     * 格上轉承遊戲
     */
    carPlusPointTransferToGamePoint = 2,
    /**
     * 遊戲轉格上紅利
     */
    gamePointTransferToCarPlusPoint = 3,
    /**
     * 遊戲點數買道具
     */
    gamePointTransferToGameItem = 4,
    /**
     * 人工補點數
     */
    manual = 5,

    /**
     * 首次登入遊戲
     */
    memberInit = 6

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
    gamePintEncryptString: string
}

export interface StartGameHistoryVM {

    /**
     * 遊戲紀錄的識別值
     */
    id: string
    gameId: string
    /**
     * 遊戲參數
     */
    gameParameters: {}
    usedItems: GameItemVM[]
    dateCreated: Date
    dateFinish: Date

    beforeScore?: number
    afterScore?: number
    changeScore?: number

    beforeExperience?: number
    changeExperience?: number
    afterExperience?: number

    beforeLevel?: number
    changeLevel?: number
    afterLevel?: number
    
    gamePoint?: number


}