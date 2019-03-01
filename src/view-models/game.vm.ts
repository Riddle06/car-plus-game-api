export interface GameVM {
    id: string
    name: string
    description: string
    imageUrl: string
    parameters: any
    code: GameCode
}

export interface GameItemUpdateParam {
    enable: boolean
}


export interface GameItemVM {
    id: string
    description: string
    name: string
    imageUrl: string
    gamePoint: number
    carPlusPoint: number
    type: GameItemType

    /**
     * 是否可以購買此商品
     */
    enableBuy: boolean
    /**
     * 動畫的路徑
     */
    spriteFolderPath: string
    levelMinLimit: number
    addScoreRate?: number
    addGamePointRate?: number
}

export enum GameItemType {
    /**
     * 角色
     */
    role = 1,
    /**
     * 道具
     */
    tool = 2,
    /**
     * 超人金幣
     */
    gamePoint = 3,
    /**
     * 格上紅利
     */
    carPlusPoint = 4
}

export interface MemberGameItemVM extends GameItemVM {
    /**
     * 此道具是否正在使用中
     */
    isUsing: boolean
    /**
     * 該會員擁有的道具紀錄 id 
     */
    memberGameItemIds: string[]
}


export interface MemberBuyGameItemParameter {
    gameItemId: string
    num: number
}

export enum GameCode {
    catch = "catch",
    shot = "shot"
}

export interface UseGameItemVM {
    /**
     * 道具類型
     */
    type: GameItemType
    gameItemId: string
    isUsing: boolean
    usingMemberGameItemId?: string
    usingRemainTimes?: number
    totalGameItemCount: number
    /**
     * 該會員目前擁有的道具 id 
     */
    memberGameItemIds: string[]
    /**
     * 道具資訊
     */
    gameItem: GameItemVM

}


export interface Variable {
    /**
     * 分享文案 {{score}} 是要取代的參數
     */
    shareText: string
    host: string
}