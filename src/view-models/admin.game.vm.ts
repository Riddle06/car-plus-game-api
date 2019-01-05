import { GameVM } from '@view-models/game.vm';
import { MemberInformationVM } from '@view-models/member.vm';

export interface AdminMemberGameHistoryVM {
    id: string
    memberId: string
    game: {
        id: string
        name: string
    }
    dateCreated: Date
    member: {
        id: string
        nickName: string
        carPlusMemberId: string
        shortId: string
    }
    score: number
    point: number
    isFinish: boolean
    dateFinished: null | Date
}


export interface AdminMemberGameHistoryParameterVM {
    memberId?: string
    shortId?: string
}

export interface AdminGameDashboardVM {

    /**
     * 登入人數
     */
    memberCount: number

    /**
     * 遊戲場次
     */
    gameCount: number

    /**
     * 總遊戲人次
     */
    memberHasPlayGameCount: number

}