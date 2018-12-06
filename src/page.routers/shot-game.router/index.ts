import { Router } from "express";
import { gameSvc } from "@services";
import { GameCode } from "@view-models/game.vm";
import { RequestExtension, ResponseExtension } from "@view-models/extension";


const router = Router()

router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {
    const gamesListRet = await gameSvc.getGameList();
    const game = gamesListRet.items.find(game => game.code === GameCode.shot)
    res.render('pages/game-intro', {
        game,
        isCatchGame: false,
        scale: req._scale
    })
});

router.get('/result/:id', (req: RequestExtension, res: ResponseExtension, next) => {
    const { id } = req.params;
    res.render('pages/game-result', {
        id,
        isCatchGame: false,
        scale: req._scale
    })
})

router.get('/:id', (req, res, next) => {
    const { id } = req.params;
    res.render('pages/shot-game', {
        id,
        scale: 1,
    })
})



export default router;