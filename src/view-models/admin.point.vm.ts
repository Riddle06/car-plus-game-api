import { GameItemVM } from './game.vm';
import { MemberInformationVM } from './member.vm';

export interface AdminMemberGameItemQueryParameterVM {
    memberId: string
}

export interface AdminMemberGameItemOrderVM {
    id: string
    member: {
        id: string
        nickName: string
    }

    gameItem: {
        id: string
        name: string
    }
    pointType: PointType
    pointAmount: number
    gameItemCount: number
    dateCreated: Date

}


/**
 * 客訴補幣紀錄
 */
export interface AdminMemberPointHistoryVM {
    id: string
    memberId: string
    gameItemId: string
    member: {
        id: string
        nickName: string
    }
    gameItem: {
        id: string
        name: string
    }
    pointType: PointType
    beforeGamePoint: number
    changeGamePoint: number
    afterGamePoint: number
    beforeCarPlusPoint: number
    changeCarPlusPoint: number
    afterCarPlusPoint: number
    adminUserName: string
    adminUserId: string
    dateCreated: Date
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