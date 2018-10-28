import { BaseGame } from "../base.game";

export class CatchGame extends BaseGame {
    protected initElements(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    protected initElementsOffset(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    protected initElementsEvents(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}