import express from 'express'
import passport from 'passport'
import passportJWT from '../../../config/passport-jwt-strategy.js'
import {
	createComment,
	deleteComment,
} from '../../../controllers/api/v1/comments.js'

const router = express.Router()
/* /api/v1/comments/create */
router.post(
	'/create',
	passport.authenticate('jwt', { session: false }),
	createComment
)
/* /api/v1/comments/delete/:commentId */
router.delete(
	'/delete/:commentId',
	passport.authenticate('jwt', { session: false }),
	deleteComment
)

export default router
