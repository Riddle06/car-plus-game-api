import { GameItemVM } from './game.vm';
import { MemberInformationVM } from './member.vm';

export interface AdminMemberGameItemQueryParameterVM {
    memberId: string
}

export interface AdminMemberGameItemOrderVM {
    id: string
    memberId: string
    gameItemId: string
    pointType: PointType
    pointAmount: number
    gameItemCount: number
    dateCreated: Date
    member: MemberInformationVM
    gameItem: GameItemVM
}

/**
 * 會員兌換紀錄及客訴補幣紀錄
 */
export interface AdminMemberPointHistoryVM {
    id: string
    memberId: string
    gameItemId: string
    member: MemberInformationVM
    gameItem: GameItemVM
    pointType: PointType
    beforeGamePoint: number
    changePoint: number
    afterGamePoint: number
    beforeCarPlusPoint: number
    afterCarPlusPoint: number
    changeCarPlusPoint: number
    adminUserName: string
    adminUserId: string
}

/**
* 花費單位
*/
export enum PointType {
    /**
     * 格上
     */
    carPlus = 1,
    /**
     * 遊戲點數
     */
    gamePoint = 2
}


export interface CreateAdminMemberPointHistoryParameterVM {
    adminUserName: string
    memberId: string
    gamePoint: number
    reason: string
}