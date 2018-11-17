import { Router } from "express";
import { gameSvc } from "@services";
import { GameCode } from "@view-models/game.vm";

const router = Router()

router.get('/', async (req, res, next) => {
    const gamesListRet = await gameSvc.getGameList();
    const game = gamesListRet.items.find(game => game.code === GameCode.shot)
    res.render('pages/game-intro', {

        game
    })
});

router.get('/:id', async (req, res, next) => {
    res.render('pages/shot-game', {
   
    })
})

export default router;