import { Router } from "express";
import { gameSvc } from "@services";
import { GameCode } from "@view-models/game.vm";
import { RequestExtension, ResponseExtension } from "@view-models/extension";

const router = Router();

router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {
    const gamesListRet = await gameSvc.getGameList();
    const game = gamesListRet.items.find(game => game.code === GameCode.catch)
    res.render('pages/game-intro', {
        game,
        isCatchGame: true,
        scale: req._scale
    })
});

router.get('/:id', async (req, res, next) => {
    res.render('pages/catch-game', {
        sacle: 1,
    })
})

export default router;