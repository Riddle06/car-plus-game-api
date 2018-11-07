import { BaseMemberGame } from "./base-member.game";
import { Result } from "@view-models/common.vm";
import { StartGameHistoryVM } from "@view-models/game-history.vm";
import { MemberGameHistoryEntity } from "@entities/member-game-history.entity";
import { uniqueId } from "@utilities";

export class ShotGameType extends BaseMemberGame {
    async getExperienceByScore(score: number): Promise<number> {
        return score;
    }
    
}