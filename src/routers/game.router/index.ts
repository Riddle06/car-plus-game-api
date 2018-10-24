import { Router } from "express";
import GameHistoryRouter from "./game-history.router";
import GameItemRouter from "./game-item.router";
import { RequestExtension, ResponseExtension } from "view-models/extension";
import { AppError } from "@view-models/common.vm";
import { gameSvc } from "@services";

const router = Router();

router.use('/history', GameHistoryRouter);
router.use('/item', GameItemRouter);

// 取得遊戲項目
router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        res.result = await gameSvc.getGameList();
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
});

// 取得問與答
router.get('/question', async (req: RequestExtension, res: ResponseExtension, next) => {

    try {
        res.result = null;
    } catch (error) {
        res.appError = AppError.getAppError(error)
    }
    next();
})



export default router;