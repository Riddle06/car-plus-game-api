import { Router } from "express";
import * as path from "path";

const router = Router();


router.get('/', async (req, res, next) => {
    res.render('pages/index', {
        layout: 'layouts/index',
        item: 'testitem'
    })

})


router.get('/shot-game', async (req, res, next) => {
    res.render('pages/shot-game', {
        layout: 'layouts/index'
    })

})

router.get('/catch-game', async (req, res, next) => {
    res.render('pages/catch-game', {
        layout: 'layouts/index'
    })
})


export default router;