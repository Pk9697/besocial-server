import express from 'express'
import userRoutes from './users.js'
import postRoutes from './posts.js'
import commentRoutes from './comments.js'
import likeRoutes from './likes.js'
import friendshipRoutes from './friendships.js'
import chatRoutes from './chats.js'

const router = express.Router()

router.use('/users', userRoutes)
router.use('/posts', postRoutes)
router.use('/comments', commentRoutes)
router.use('/likes', likeRoutes)
router.use('/friendship', friendshipRoutes)
router.use('/chats', chatRoutes)

export default router
