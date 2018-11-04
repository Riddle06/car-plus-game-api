import { GameVM } from '@view-models/game.vm';
import { GameItemVM } from '@view-models/game.vm';
import { GameQuestionVM } from '@view-models/game-question.vm';
import { ListResult } from '@view-models/common.vm';
import { Result } from '@view-models/common.vm';
import { BaseWebSvc } from "./base-web.svc";
import { MemberLoginCreateParameterVM } from "@view-models/member.vm";

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

    async startGame() {

    }

    async reportGame() {

    }

    async buyGameItem() {

    }
}