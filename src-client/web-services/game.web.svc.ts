import { MemberBuyGameItemParameter } from './../../src/view-models/game.vm';
import { ReportPlayGameParameterVM } from '@view-models/game-history.vm';
import { StartGameHistoryVM, PlayGameParameterVM } from '@view-models/game-history.vm';
import { GameVM } from '@view-models/game.vm';
import { GameItemVM } from '@view-models/game.vm';
import { GameQuestionVM } from '@view-models/game-question.vm';
import { ListResult, BaseResult } from '@view-models/common.vm';
import { Result } from '@view-models/common.vm';
import { BaseWebSvc } from "./base-web.svc";

export class GameWebSvc extends BaseWebSvc {

    /**
     * [GET] /api/game
     * 取得遊戲項目
     */
    async getGameList(): Promise<ListResult<GameVM>> {
        const res = await this.axiosInstance.get<ListResult<GameVM>>('/api/game');
        return res.data
    }

      /**
     * [GET] /api/game/variable
     * 取得遊戲基本參數
     * @returns {shareText} 分享文案
     * @returns {host} 網址
     */
    async getGameVariable(): Promise<ListResult<GameVM>> {
        const res = await this.axiosInstance.get<ListResult<GameVM>>('/api/game/variable');
        return res.data
    }

    /**
     * [GET] /api/game/question
     *  取得問與答
     * */
    async getQuestions(): Promise<ListResult<GameQuestionVM>> {
        const res = await this.axiosInstance.get<ListResult<GameQuestionVM>>('/api/game/question');
        return res.data
    }

    /**
     * [GET] api/game/item
     * 取得所有遊戲道具資訊
     */
    async getGameItems(): Promise<ListResult<GameItemVM>> {
        const res = await this.axiosInstance.get<ListResult<GameItemVM>>('/api/game/item');
        return res.data
    }

    /**
     * [GET] api/game/item/:id
     * 取得單一道具資訊
     */
    async getGameItemById(id: string): Promise<Result<GameItemVM>> {
        const res = await this.axiosInstance.get<Result<GameItemVM>>(`/api/game/item/${id}`);
        return res.data
    }

    /**
     * [POST] /api/game/history
     * 新增一筆遊戲
     * @returns {String} id ，回傳 id 為 會員遊玩的該筆的紀錄
     */
    async startGame(param: PlayGameParameterVM): Promise<Result<StartGameHistoryVM>> {
        const res = await this.axiosInstance.post<Result<StartGameHistoryVM>>('/api/game/history', param);
        return res.data
    }

    /**
     * [PUT] /api/game/history/:id
     * 回報遊戲分數
     * @param {String} id id 為 會員遊玩的該筆的紀錄
     */
    async reportGame(historyId: string, param: ReportPlayGameParameterVM) {
        const res = await this.axiosInstance.put<Result<StartGameHistoryVM>>(`/api/game/history/${historyId}`, param);
        return res.data
    }

    /**
     * [GET] /api/game/history/:id
     * 取得該筆遊戲資料，用在結算頁面
     * @param {String} historyId id 為 會員遊玩的該筆的紀錄
     */
    async getGameHistory(historyId: string) {
        const res = await this.axiosInstance.get<Result<StartGameHistoryVM>>(`/api/game/history/${historyId}`);
        return res.data
    }

    /**
     * [POST] /api/game/item
     * 購買道具，可以一次買多個
     */
    async buyGameItem(param: MemberBuyGameItemParameter): Promise<BaseResult> {
        const res = await this.axiosInstance.post<BaseResult>(`/api/game/item`, param);
        return res.data
    }


}