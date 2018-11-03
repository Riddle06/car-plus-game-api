import { BaseMemberGame } from "../member-game.lib.svc";
import { Result } from "@view-models/common.vm";
import { StartGameHistoryVM } from "@view-models/game-history.vm";

export class ShotGameType extends BaseMemberGame {
    init(): Promise<this> {
        throw new Error("Method not implemented.");
    }
    startGame(): Promise<Result<StartGameHistoryVM>> {
        throw new Error("Method not implemented.");
    }
    reportGame(): Promise<Result<StartGameHistoryVM>> {
        throw new Error("Method not implemented.");
    }
}