import express from 'express'
import passport from 'passport'
import passportJWT from '../../../config/passport-jwt-strategy.js'
import { toggleFriendship } from '../../../controllers/api/v1/friendships.js'

const router = express.Router()
/* api/v1/friendships/toggle/:friendId*/
router.post(
	'/toggle/:friendId',
	passport.authenticate('jwt', { session: false }),
	toggleFriendship
)

export default router
