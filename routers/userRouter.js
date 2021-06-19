const router = require('express').Router()
const { signUp, signIn } = require('../controllers/userControllers')
const authorized = require('../middlewares/authorize')
const admin = require('../middlewares/admin')


router.route('/signup')
    .post(signUp)

router.route('/signin')
    .post(signIn)

module.exports = router