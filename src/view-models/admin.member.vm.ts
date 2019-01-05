import { GameItemVM } from './game.vm';
import { MemberInformationVM } from "./member.vm";
import shortid = require('shortid');

export interface AdminMemberVM extends MemberInformationVM {
    gameItems?: AdminMemberGameItemVM[]
    isBlock: boolean

}

export interface AdminMemberGameItemVM extends GameItemVM {
    num: number
}

export interface AdminMemberEntityQueryParameterVM {
}

export interface AdminMemberBlockParameter {
    shortId: string
    reason: string
    adminUserName: string
}

export interface AdminMemberBlockHistoryVM {
    id: string
    memberId: string
    carPlusMemberId: string
    memberShortId: string
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
    shortId: string
}

export interface AdminMemberListQueryParameterVM {
    memberId: string
    keyword: string
    shortId: string
}