import { GameVM } from '@view-models/game.vm';
import { MemberInformationVM } from '@view-models/member.vm';

export interface AdminMemberGameHistoryVM {
    id: string
    memberId: string
    game: GameVM
    dateCreated: Date
    member: MemberInformationVM
    score: number
    point: number
    isFinish: boolean
    dateFinished: null | Date
}


export interface AdminMemberGameHistoryParameterVM {
    memberId?: string
}

export interface AdminGameDashboardVM {
    loginCount: number
    totalGameCount: number
}