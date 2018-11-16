import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";

const router = Router();

// 營運報表
router.get('/dashboard', async (req: RequestExtension, res: ResponseExtension, next) => {

    next();
})

export default router;