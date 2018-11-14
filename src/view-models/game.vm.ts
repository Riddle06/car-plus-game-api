export interface GameVM {
    id: string
    name: string
    description: string
    imageUrl: string
    parameters: any
    code: GameCode
}


export interface GameItemVM {
    id: string
    description: string
    name: string
    imageUrl: string
    gamePoint: number
    carPlusPoint: number
    type: GameItemType
    enableBuy: boolean
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
    isUsing: boolean
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
    type: GameItemType
    gameItemId: string
    isUsing: boolean
    usingMemberGameItemId?: string
    usingRemainTimes?: number
    totalGameItemCount: number
    memberGameItemIds: string[]
    gameItem: GameItemVM

}