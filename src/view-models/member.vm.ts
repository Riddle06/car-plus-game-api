import { GameItemVM } from '@view-models/game.vm';
export interface MemberInformationVM {
    id: string
    nickName: string
    carPlusPoint: number
    gamePoint: number
    level: number
    experience: number
    carPlusMemberId: string
    currentRoleGameItem: GameItemVM
}

export interface MemberUpdateInformationParameterVM {
    nickName: string
}

export interface MemberLoginCreateParameterVM {
    clientId: string
    carPlusMemberId: string
}