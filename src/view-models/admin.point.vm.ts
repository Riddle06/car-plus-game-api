import { GameItemVM } from './game.vm';
export interface AdminMemberPointHistoryVM {
    memberId: string
    gameItemId: string
    gameItemVM: GameItemVM
    pointType: PointType
}

export enum PointType {
    carPlus = 1,
    gamePoint = 2
}