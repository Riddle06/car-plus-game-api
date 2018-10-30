export interface GameVM {
    id: string
    name: string
    description: string
    imageUrl: string
    parameters: any
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
    haveItem: boolean
    haveItemCount: number
    dateCreated: Date
}


export interface MemberBuyGameItemParameter {
    gameItemId: string
    num: number
}