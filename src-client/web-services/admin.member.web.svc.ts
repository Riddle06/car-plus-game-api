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
        pageIndex: 1,
        pageSize: 10
    }, param: { memberId?: string, shortId?: string } = {
        memberId: '',
        shortId: ''
    }): Promise<ListResult<AdminMemberGameHistoryVM>> {
        const res = await this.axiosAdminInstance.get('/admin/api/member/game/history', {
            params: {
                ...pageInfo,
                mi: param.memberId,
                shortId: param.shortId
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
        pageIndex: 1,
        pageSize: 10
    }): Promise<ListResult<AdminMemberPointHistoryVM>> {

        const res = await this.axiosAdminInstance.get('/admin/api/member/point/history/manual', {
            params: {
                ...pageInfo
            }
        })

        return res.data;
    }

    /**
     * 取得紅利兌換紀錄
     */
    async getGamePointExchangeHistories(pageInfo: PageInfo = {
        pageIndex: 1,
        pageSize: 10
    }, param: { memberId?: string, shortId?: string } = { memberId: "", shortId: "" }) {
        const res = await this.axiosAdminInstance.get('/admin/api/member/point/history/exchange', {
            params: {
                ...pageInfo,
                mi: param.memberId,
                shortId: param.shortId
            }
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
        pageIndex: 1,
        pageSize: 10
    }, param: { memberId?: string, shortId?: string } = { memberId: "", shortId: "" }): Promise<ListResult<AdminMemberBlockHistoryVM>> {
        const res = await this.axiosAdminInstance.get(`/admin/api/member/block-history`,
            {
                params: {
                    ...pageInfo,
                    mi: param.memberId,
                    shortId: param.shortId
                }
            })
        return res.data
    }

    /**
     * 會員總覽：取得消費者列表
     * @param {param.keyword} 關鍵字
     */
    async getMembers(pageInfo: any = { pageIndex: 1, pageSize: 10 }, param: { memberId?: string, keyword?: string, shortId?: string } = { memberId: "", shortId: "" }): Promise<ListResult<AdminMemberVM>> {
        const res = await this.axiosAdminInstance.get<ListResult<AdminMemberVM>>(`/admin/api/member`, {
            params: {
                ...pageInfo,
                mi: param.memberId,
                keyword: param.keyword,
                shortId: param.shortId
            }
        })
        return res.data
    }

    /**
     * 取得會員詳細資訊，包含個商品擁有列表
     * @param id 
     */
    async getMemberDetail(id: string): Promise<Result<AdminMemberVM>> {
        const res = await this.axiosAdminInstance.get<Result<AdminMemberVM>>(`/admin/api/member/${id}`)
        return res.data
    }


}