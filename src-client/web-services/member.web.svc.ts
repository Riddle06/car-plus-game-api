import { Result, BaseResult, ListResult } from '@view-models/common.vm';
import { BaseWebSvc } from "./base-web.svc";
import { MemberInformationVM, MemberUpdateInformationParameterVM } from "@view-models/member.vm";
import { UseGameItemVM } from '@view-models/game.vm';

export class MemberWebSvc extends BaseWebSvc {

    async updateNickName(param: MemberUpdateInformationParameterVM): Promise<Result<MemberInformationVM>> {
        const res = await this.axiosInstance.put<Result<MemberInformationVM>>('/api/member/nick-name', param)
        return res.data
    }

    async getProfile(): Promise<Result<MemberInformationVM>> {
        const res = await this.axiosInstance.get<Result<MemberInformationVM>>('/api/member')
        return res.data;
    }

    async useGameItem(memberGameItemId: string): Promise<BaseResult> {
        const res = await this.axiosInstance.get<Result<BaseResult>>(`/api/member/game-item/${memberGameItemId}`);
        return res.data;
    }

    async getUsableGameItems(): Promise<ListResult<UseGameItemVM>> {
        const res = await this.axiosInstance.get<ListResult<UseGameItemVM>>('/api/member/game-item/usable');
        return res.data
    }

}