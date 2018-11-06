import { BaseMemberGame } from "./base-member.game";
import { Result } from "@view-models/common.vm";
import { StartGameHistoryVM } from "@view-models/game-history.vm";

export class CatchGameType extends BaseMemberGame {
    
    getExperienceByScore(score: number): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getGamePointByScore(score: number): Promise<number> {
        throw new Error("Method not implemented.");
    }


}