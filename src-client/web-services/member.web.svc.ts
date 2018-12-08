import { LevelUpInformation } from '@view-models/variable.vm';
import { Result, BaseResult, ListResult } from '@view-models/common.vm';
import { BaseWebSvc } from "./base-web.svc";
import { MemberInformationVM, MemberUpdateInformationParameterVM } from "@view-models/member.vm";
import { UseGameItemVM, MemberGameItemVM } from '@view-models/game.vm';

export class MemberWebSvc extends BaseWebSvc {

    /**
     * [PUT] /api/member/nick-name
     * 修改暱稱
     */
    async updateNickName(param: MemberUpdateInformationParameterVM): Promise<Result<MemberInformationVM>> {
        const res = await this.axiosInstance.put<Result<MemberInformationVM>>('/api/member/nick-name', param)
        return res.data
    }

    /**
     * [GET] /api/member
     * 取得會員資料
     */
    async getProfile(): Promise<Result<MemberInformationVM>> {
        const res = await this.axiosInstance.get<Result<MemberInformationVM>>('/api/member')
        return res.data;
    }
    /**
     * [PUT] /api/member/game-item/:id
     * 使用此道具
     * @param {String} memberGameItemId 此識別值為 `memberGameItemId` 欄位中的 id
     */
    async useGameItem(memberGameItemId: string): Promise<BaseResult> {
        const res = await this.axiosInstance.put<Result<BaseResult>>(`/api/member/game-item/${memberGameItemId}`);
        return res.data;
    }

    /**
     * [GET] /api/member/game-item/usable
     * 取得目前會員可使用的道具資訊
     */
    async getUsableGameItems(): Promise<ListResult<UseGameItemVM>> {
        const res = await this.axiosInstance.get<ListResult<UseGameItemVM>>('/api/member/game-item/usable');
        return res.data
    }

    /**
     * [GET] /api/member/game-item/usable
     * 取得目前會員可使用的道具資訊
     */
    async getMemberItems(): Promise<ListResult<MemberGameItemVM>> { 
        const res = await this.axiosInstance.get<ListResult<MemberGameItemVM>>('/api/member/game-item');
        return res.data
    }

    /**
     * 各個等級資訊
     */
    async getLevelInfo(): Promise<ListResult<LevelUpInformation>> {
        const res = await this.axiosInstance.get<ListResult<LevelUpInformation>>('/api/member/level-info');
        return res.data
    }

}