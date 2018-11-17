import { GameItemVM } from './game.vm';
import { MemberInformationVM } from "./member.vm";

export interface AdminMemberVM extends MemberInformationVM {
    gameItems: AdminMemberGameItemVM[]

}

export interface AdminMemberGameItemVM extends GameItemVM {
    num: number
}

export interface AdminMemberEntityQueryParameterVM {
}