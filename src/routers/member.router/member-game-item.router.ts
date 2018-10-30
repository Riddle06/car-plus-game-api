import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";

const router = Router();

// 使用此道具
router.put('/:id', async (req: RequestExtension, res: ResponseExtension, next) => {
    const memberGameItemId = req.params.id;

})

export default router