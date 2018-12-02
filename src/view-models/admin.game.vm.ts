import { GameVM } from '@view-models/game.vm';
import { MemberInformationVM } from '@view-models/member.vm';

export interface AdminMemberGameHistoryVM {
    id: string
    memberId: string
    game: {
        id:string
        name:string
    }
    dateCreated: Date
    member: {
        id: string
        nickName: string
    }
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