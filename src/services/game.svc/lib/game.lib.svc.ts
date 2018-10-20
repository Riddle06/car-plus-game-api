import { BaseConnection } from "@services/base-connection";
import { BaseResult, ListResult } from "@view-models/common.vm";
import { GameVM } from "@view-models/game.vm";
import { GameEntity } from "@entities/game.entity";

export class GameLibSvc extends BaseConnection {
    async getGameList(): Promise<ListResult<GameVM>> {
        const gameEntities = await this.entityManager.getRepository(GameEntity).find()

        const ret = new ListResult<GameVM>();
        ret.items = gameEntities.map(entity => {
            const { id, description, parameters, name, gameCoverImageUrl } = entity
            const game: GameVM = {
                id,
                description,
                imageUrl: gameCoverImageUrl,
                name,
                parameters
            }
            return game;
        })

        return ret.setResultValue(true)
    }
}