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
    role = "role",
    tool = "tool"
}

export interface MemberGameItem extends GameItem {
    haveThisItem: boolean
    dateCreated: Date
}