export interface Game {
    id: string
    name: string
    description: string
    imageUrl: string
    parameters: any
}


export interface GameItem {
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

export interface MemberGameItem extends GameItem {
    haveThisItem: boolean
    dateCreated: Date
}