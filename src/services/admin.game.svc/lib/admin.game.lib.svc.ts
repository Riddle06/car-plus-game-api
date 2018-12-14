import { BaseConnection } from "@services/base-connection";
import { ListResult, Result, AppError } from "@view-models/common.vm";
import { GameVM, GameCode } from "@view-models/game.vm";
import { GameEntity } from "@entities/game.entity";
import { checker } from "@utilities";

export class AdminGameLibSvc extends BaseConnection {
    async getGameList(): Promise<ListResult<GameVM>> {

        const games = await this.entityManager.getRepository(GameEntity).find();

        const ret = new ListResult<GameVM>(true);

        ret.items = games.map(game => {
            const { id, name, description, gameCoverImageUrl, code, parameters } = game
            const item: GameVM = {
                id,
                name,
                description,
                imageUrl: gameCoverImageUrl,
                parameters: JSON.parse(parameters),
                code: code as GameCode
            }
            return item
        });

        return ret;
    }

    async updateGameParameter(id: string, parameter: object): Promise<Result<GameVM>> {

        const gameEntity = await this.entityManager.getRepository(GameEntity).findOne(id);

        if (checker.isNullOrUndefinedObject(gameEntity)) {
            throw new AppError('查無遊戲資料')
        }

        if (typeof parameter !== "object") { 
            throw new AppError('參數型態錯誤')
        }

        let parameters: string = null
        try {
            parameters = JSON.stringify(parameter)
        } catch (error) {
            throw new AppError('參數解析失敗')
        }


        await this.entityManager.getRepository(GameEntity).update({ id }, {
            parameters
        });


        const ret = new Result<GameVM>(true);
        const { description, code, gameCoverImageUrl, name } = gameEntity;

        ret.item = {
            id,
            name,
            imageUrl: gameCoverImageUrl,
            code: code as GameCode,
            parameters: parameter,
            description,
        }

        return ret;
    }
}