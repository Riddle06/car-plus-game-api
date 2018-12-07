import { GameItemVM, GameCode } from './../../../view-models/game.vm';
import { GameItemEntity } from './../../../entities/game-item.entity';
import { BaseConnection } from "@services/base-connection";
import { BaseResult, ListResult, Result, AppError } from "@view-models/common.vm";
import { GameVM } from "@view-models/game.vm";
import { GameEntity } from "@entities/game.entity";
import { checker } from '@utilities';

export class GameLibSvc extends BaseConnection {
    async getGameList(): Promise<ListResult<GameVM>> {
        const gameEntities = await this.entityManager.getRepository(GameEntity).find()

        const ret = new ListResult<GameVM>();
        ret.items = gameEntities.map(entity => {
            const { id, description, parameters, name, gameCoverImageUrl, code } = entity
            const game: GameVM = {
                id,
                description,
                imageUrl: gameCoverImageUrl,
                name,
                parameters,
                code: code as GameCode
            }
            return game;
        })

        return ret.setResultValue(true)
    }

    async getGameItemById(gameItemId: string): Promise<Result<GameItemVM>> {
        const gameItemRepository = await this.entityManager.getRepository(GameItemEntity);

        const gameItemEntity = await gameItemRepository.findOne({
            where: {
                id: gameItemId
            },
            order: {
                type: "ASC",
                gamePoint: "ASC"
            }
        })

        if (checker.isNullOrUndefinedObject(gameItemEntity)) {
            throw new AppError('此道具不存在')
        }

        const ret = new Result<GameItemVM>();

        const { id, description, name, imageUrl, gamePoint, carPlusPoint, type, spriteFolderPath } = gameItemEntity

        ret.item = {
            id,
            description,
            name,
            imageUrl,
            gamePoint,
            carPlusPoint,
            type,
            enableBuy: true,
            spriteFolderPath
        }

        return ret.setResultValue(true);
    }

    async getGameItems(reMemberId: string): Promise<ListResult<GameItemVM>> {
        const gameItemRepository = await this.entityManager.getRepository(GameItemEntity);

        const gameItemEntities = await gameItemRepository.find({
            where: {
                enabled: true
            },
            order: {
                type: "ASC",
                gamePoint: "ASC"
            }
        })

        const ret = new ListResult<GameItemVM>();
        ret.items = gameItemEntities.map(gameItemEntity => {
            const { id, description, name, imageUrl, gamePoint, carPlusPoint, type, spriteFolderPath } = gameItemEntity
            const gameItemVM: GameItemVM = {
                id,
                description,
                name,
                imageUrl,
                gamePoint,
                carPlusPoint,
                type,
                enableBuy: true,
                spriteFolderPath
            }

            return gameItemVM;
        })

        return ret.setResultValue(true);
    }
}