import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";

const router = Router();

// 取得該登入帳號資訊
router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    next();
})

// 登入
router.post('/login', async (req: RequestExtension, res: ResponseExtension, next) => {

    next();
})


// 登出
router.put('/logout', async (req: RequestExtension, res: ResponseExtension, next) => {

    next();
})

export default router;