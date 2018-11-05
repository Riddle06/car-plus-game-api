import { Router } from "express";

const router = Router();

router.get('/question', async (req, res, next) => {
    res.render('pages/question', {
        layout: 'layouts/index'
    })
})

export default router;