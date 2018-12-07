import { Router } from "express";
import { RequestExtension, ResponseExtension } from "@view-models/extension";


const router = Router();

router.get('/', async (req: RequestExtension, res: ResponseExtension, next) => {
    res.render('pages/shop', {
        scale: req._scale
    })
})

router.get('/:id', async (req: RequestExtension, res: ResponseExtension, next) => {
    const { id } = req.params;
    res.render('pages/shop-merch', {
        id,
        scale: req._scale
    })
})


export default router;


