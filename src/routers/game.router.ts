import { Router } from "express";
import GameHistoryRouter from "./game-history.router";
import { RequestExtension } from "view-models/extension";

const router = Router();

router.use('/', GameHistoryRouter);

// 取得遊戲項目
router.get('/', async (req: RequestExtension, res, next) => {
    next();
});

// 取得問與答
router.get('/question', async (req: RequestExtension, res, next) => {
    next();
})

// 取得遊戲道具資訊
router.get('/item', async (req: RequestExtension, res, next) => {
    next();
})

// 取得單一道具資訊
router.get('/item/:id', async (req: RequestExtension, res, next) => {
    next();
})

// 購買道具
router.post('/item/:id', async (req: RequestExtension, res, next) => {
    next();
})

// 開始遊戲
router.post('/:id', async (req: RequestExtension, res, next) => {

})

// 回報遊戲
router.put('/:id', async (req: RequestExtension, res, next) => {

})


export default router;