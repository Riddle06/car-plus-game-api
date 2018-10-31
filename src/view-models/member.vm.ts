export interface MemberInformationVM {
    id: string
    nickName: string
    carPlusPoint: number
    gamePoint: number
    level: number
    experience: number
    carPlusMemberId: string
}

export interface MemberUpdateInformationParameterVM {
    nickName: string
}

export interface MemberLoginCreateParameterVM {
    clientId: string
    carPlusMemberId: string
}