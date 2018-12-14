import { GameItemVM } from './game.vm';
import { MemberInformationVM } from "./member.vm";

export interface AdminMemberVM extends MemberInformationVM {
    gameItems?: AdminMemberGameItemVM[]

}

export interface AdminMemberGameItemVM extends GameItemVM {
    num: number
}

export interface AdminMemberEntityQueryParameterVM {
}

export interface AdminMemberBlockParameter {
    carPlusMemberId: string
    reason: string
    adminUserName: string
}

export interface AdminMemberBlockHistoryVM {
    id: string
    memberId: string
    carPlusMemberId: string
    adminUserId: string
    reason: string
    dateCreated: Date
    dateUpdated: Date
    adminUserName: string
    isDeleted: boolean
    deleteAdminUserName?: string
    deleteAdminUserId?: string
    memberNickName?: string

}

export interface AdminMemberBlockListQueryParameterVM {
    memberId: string
}

export interface AdminMemberListQueryParameterVM {
    memberId: string
    keyword: string

}