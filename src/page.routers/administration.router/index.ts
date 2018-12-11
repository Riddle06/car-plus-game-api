import { Router } from "express";


const router = Router();

const defaultOptions = {
  layout: 'admin.layout.hbs',
  showMenu: true,
}

router.get('/', async (req, res, next) => {
  res.render('pages/admin/index', {
    ...defaultOptions,
    menuActive: 0,
  })
});

router.get('/login', async (req, res, next) => {
  res.render('pages/admin/login', {
    ...defaultOptions,
    showMenu: false,
    menuActive: 0
  })
})

router.get('/members', async (req, res, next) => {
  res.render('pages/admin/members', {
    ...defaultOptions,
    menuActive: '1-1'
  })
})

router.get('/game-history', async (req, res, next) => {
  res.render('pages/admin/game-history', {
    ...defaultOptions,
    menuActive: '1-2'
  })
})

router.get('/point-history', async (req, res, next) => {
  res.render('pages/admin/point-history', {
    ...defaultOptions,
    menuActive: '2'
  })
})

router.get('/supplement', async (req, res, next) => {
  res.render('pages/admin/supplement', {
    ...defaultOptions,
    menuActive: '3'
  })
})

router.get('/report', async (req, res, next) => {
  res.render('pages/admin/report', {
    ...defaultOptions,
    menuActive: '4'
  })
})

router.get('/blacklist', async (req, res, next) => {
  res.render('pages/admin/blacklist', {
    ...defaultOptions,
    menuActive: '5'
  })
})

export default router;