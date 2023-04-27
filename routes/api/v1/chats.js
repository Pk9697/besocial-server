import express from 'express'
import passport from 'passport'
import passportJWT from '../../../config/passport-jwt-strategy.js'
import {
	createChat,
	getChatRoomChats,
} from '../../../controllers/api/v1/chats.js'

const router = express.Router()
/* /api/v1/chats/create */
router.post(
	'/create',
	passport.authenticate('jwt', { session: false }),
	createChat
)
/* /api/v1/chats/ */
router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	getChatRoomChats
)

export default router
