export interface GameVM {
    id: string
    name: string
    description: string
    imageUrl: string
    parameters: any
}


export interface GameItemVM {
    id: string
    imageUrl: string
    gamePoint: number
    type: GameItemType
}

export enum GameItemType {
    /**
     * 角色
     */
    role = 1,
    /**
     * 道具
     */
    tool = 2
}

export interface MemberGameItemVM extends GameItemVM {
    haveThisItem: boolean
    dateCreated: Date
}