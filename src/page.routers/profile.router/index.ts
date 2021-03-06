import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";

const router = Router();

router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {

    res.render('pages/profile', {
        scale: req._scale
    });
    
})

router.get('/game-item/:id', async (req: RequestExtension, res: ResponseExtension, next) => {
    const { id } = req.params;
    res.render('pages/game-item', {
        id,
        scale: req._scale
    });
    
})

export default router;