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

    async getGameList(): Promise<ListResult<GameVM>> {
        const res = await this.axiosInstance.get<ListResult<GameVM>>('/api/game');
        return res.data
    }

    async getQuestions(): Promise<ListResult<GameQuestionVM>> {
        const res = await this.axiosInstance.get<ListResult<GameQuestionVM>>('/api/game/question');
        return res.data
    }

    async getGameItems(): Promise<ListResult<GameItemVM>> {
        const res = await this.axiosInstance.get<ListResult<GameItemVM>>('/api/game/item');
        return res.data
    }

    async startGame(param: PlayGameParameterVM): Promise<Result<StartGameHistoryVM>> {
        console.log(`params`, param)
        const res = await this.axiosInstance.post<Result<StartGameHistoryVM>>('/api/game/history', param);
        return res.data
    }

    async reportGame(historyId: string, param: ReportPlayGameParameterVM) {
        const res = await this.axiosInstance.put<Result<StartGameHistoryVM>>(`/api/game/history/${historyId}`, param);
        return res.data
    }

    async buyGameItem(param: MemberBuyGameItemParameter): Promise<BaseResult> {
        const res = await this.axiosInstance.post<BaseResult>(`/api/game/item`, param);
        return res.data
    }


}