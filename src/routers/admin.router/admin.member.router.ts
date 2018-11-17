import { Router } from "express";
import MemberGameHistoryRouter from "./admin.member.game.history.router";
import MemberPointHistoryRouter from "./admin.member.point.history.router";
import { RequestExtension, ResponseExtension } from "@view-models/extension";


const router = Router();

router.use('/game', MemberGameHistoryRouter)

router.use('/point', MemberPointHistoryRouter)

// 會員列表
router.use('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    next();
})

// 取得
router.get('/with-game-items', async (req: RequestExtension, res: ResponseExtension, next) => {

    next();
})

// 取得封鎖列表
router.get('/block-history', async (req: RequestExtension, res: ResponseExtension, next) => {

    next();
})

// 新增黑名單
router.post('/block-history', async (req: RequestExtension, res: ResponseExtension, next) => {

    next();
})

// 刪除黑名單
router.delete('/block-history/:id', async (req: RequestExtension, res: ResponseExtension, next) => {

    next();
})

export default router;