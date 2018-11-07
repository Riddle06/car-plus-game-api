import { BaseMemberGame } from "./base-member.game";
import { Result } from "@view-models/common.vm";
import { StartGameHistoryVM } from "@view-models/game-history.vm";

export class CatchGameType extends BaseMemberGame {
    
    async getExperienceByScore(score: number): Promise<number> {
        return score;
    }

}