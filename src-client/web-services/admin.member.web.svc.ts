import { AdminMemberBlockHistoryVM, AdminMemberBlockParameter, AdminMemberVM } from '../../src/view-models/admin.member.vm';
import { AdminMemberPointHistoryVM, CreateAdminMemberPointHistoryParameterVM } from '../../src/view-models/admin.point.vm';
import { PageInfo } from './../../src/view-models/common.vm';
import { AdminMemberGameHistoryVM } from '../../src/view-models/admin.game.vm';
import { Result, ListResult } from '@view-models/common.vm';
import { BaseWebSvc } from "./base-web.svc";
export class AdminMemberWebSvc extends BaseWebSvc {

    /**
     * 取得遊戲紀錄
     */
    async getGameHistories(pageInfo: PageInfo = {
        index: 1,
        size: 10
    }, param: { memberId?: string } = {
        memberId: ''
    }): Promise<ListResult<AdminMemberGameHistoryVM>> {
        const res = await this.axiosAdminInstance.get('/admin/api/member/game/history', {
            data: {
                ...pageInfo,
                mi: param.memberId
            }
        })
        return res.data;
    }
    /**
     * 手動新增遊戲幣
     */
    async addGamePoint(param: CreateAdminMemberPointHistoryParameterVM): Promise<Result<AdminMemberPointHistoryVM>> {
        const res = await this.axiosAdminInstance.post('/admin/api/member/point', {
            ...param
        })

        return res.data;
    }

    /**
     * 取得新增遊戲幣紀錄
     */
    async getManualGamePointHistories(pageInfo: PageInfo = {
        index: 1,
        size: 10
    }): Promise<ListResult<AdminMemberPointHistoryVM>> {

        const res = await this.axiosAdminInstance.post('/admin/api/member/point/history/manual', {
            ...pageInfo
        })

        return res.data;
    }

    /**
     * 取得紅利兌換紀錄
     */
    async getGamePointExchangeHistories(pageInfo: PageInfo = {
        index: 1,
        size: 10
    }, param: { memberId: string } = { memberId: "" }) {
        const res = await this.axiosAdminInstance.post('/admin/api/member/point/history/exchange', {
            ...pageInfo,
            mi: param.memberId
        })
        return res.data;
    }

    /**
     * 新增黑名單
     */
    async blockMember(param: AdminMemberBlockParameter): Promise<Result<AdminMemberBlockHistoryVM>> {
        const res = await this.axiosAdminInstance.post('/admin/api/member/block-history', { ...param })
        return res.data;
    }


    /**
     * 移除黑名單
     */
    async unblockMember(blockHistoryId: string): Promise<Result<AdminMemberBlockHistoryVM>> {
        const res = await this.axiosAdminInstance.delete(`/admin/api/member/block-history/${blockHistoryId}`)
        return res.data
    }

    /**
     * 取得黑名單列表
     */
    async getBlockMember(pageInfo: PageInfo = {
        index: 1,
        size: 10
    }, param: { memberId: string } = { memberId: "" }): Promise<ListResult<AdminMemberBlockHistoryVM>> {
        const res = await this.axiosAdminInstance.get(`/admin/api/member/block-history`,
            {
                data: {
                    ...pageInfo,
                    mi: param.memberId
                }
            })
        return res.data
    }

    /**
     * 會員總覽：取得消費者及所屬商品數量
     */
    async getMemberWithGameItems(pageInfo: PageInfo = { index: 1, size: 10 }, param: { memberId: string } = { memberId: "" }): Promise<ListResult<AdminMemberVM>> {
        const res = await this.axiosAdminInstance.get<ListResult<AdminMemberVM>>(`/admin/api/member/with-game-items`, {
            data: {
                ...pageInfo,
                mi: param.memberId
            }
        })
        return res.data
    }



}