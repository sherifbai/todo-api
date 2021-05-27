const { Router } = require('express')
const { body } = require('express-validator')

const feedController = require('../controller/feed')
const isAuth = require('../middlewear/is-auth')

const router = Router()

router.get('/posts', isAuth, feedController.getPosts)
router.post('/post', [
    body('title')
        .isLength({min: 5})
        .trim(),
    body('content')
        .isLength({min: 5})
        .trim()
], isAuth, feedController.postPost)

router.get('/post/:postId', isAuth, feedController.getPost)

router.put('/post/:postId', [
    body('title')
        .trim()
        .isLength({min: 5}),
    body('content')
        .trim()
        .isLength({min: 5})
], isAuth, feedController.updatePost)

router.delete('/post/:postId', isAuth, feedController.deletePost)

module.exports = router
