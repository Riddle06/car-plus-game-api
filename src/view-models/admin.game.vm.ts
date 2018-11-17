import { GameItemVM } from "./game.vm";

export interface AdminMemberGameHistoryVM {
    id: string
    memberId: string
    game: GameItemVM
    dateCreated: Date
    score: number
    point: number
}


export interface AdminMemberGameHistoryParameterVM {
    memberId?: string
}

export interface AdminGameDashboardVM {
    loginCount: number
    totalGameCount: number
}