import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";

const router = Router();

// 紅包紀錄 type = 
router.get('/history', async (req: RequestExtension, res: ResponseExtension, next) => {

    next();
})

// 客訴補點
router.get('/history/manual', async (req: RequestExtension, res: ResponseExtension, next) => {

    next();
})

// 客訴補幣
router.post('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    next();
})

export default router;