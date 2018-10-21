export interface GameVM {
    id: string
    name: string
    description: string
    imageUrl: string
    parameters: any
}


export interface GameToolItemVM {
    id: string
    imageUrl: string
    gamePoint: number
    type: GameItemType
}

export enum GameItemType {
    /**
     * 角色
     */
    role = "role",
    /**
     * 道具
     */
    tool = "tool"
}

export interface MemberGameItemVM extends GameToolItemVM {
    haveThisItem: boolean
    dateCreated: Date
}