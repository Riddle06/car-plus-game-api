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
    /**
     * 活得分數（包含道具加成），遊戲後才會有值 
     */
    score?: number

    /**
     * 超人幣（包含道具加成），遊戲後才會有值 
     */
    gamePoint?: number

    /**
     * 遊戲前經驗值，遊戲後才會有值 
     */
    beforeExperience?: number
    /**
     * 遊戲獲得經驗值，遊戲後才會有值 
     */
    changeExperience?: number
    /**
     * 遊戲後經驗值，遊戲後才會有值 
     */
    afterExperience?: number

    /**
     * 遊戲前等級，遊戲後才會有值 
     */
    beforeLevel?: number
    /**
     * 異動等級，遊戲後才會有值 
     */
    changeLevel?: number
    /**
     * 遊戲後等級，遊戲後才會有值 
     */
    afterLevel?: number

    


}