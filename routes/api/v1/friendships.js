import express from 'express'
import passport from 'passport'
import passportJWT from '../../../config/passport-jwt-strategy.js'
import {
	createFriendship,
	getAllUserFriends,
	removeFriendship,
	toggleFriendship,
} from '../../../controllers/api/v1/friendships.js'

const router = express.Router()
/* api/v1/friendship/toggle/:friendId*/
router.post(
	'/toggle/:friendId',
	passport.authenticate('jwt', { session: false }),
	toggleFriendship
)

/* api/v1/friendship/fetch_user_friends */
router.get(
	'/fetch_user_friends/:userId',
	passport.authenticate('jwt', { session: false, failWithError: true }),
	getAllUserFriends,
	(err, req, res, next) => {
		return res.status(422).json({
			success: false,
			message: 'User Authentication Failed! Logging Out',
			headers: req.headers,
		})
	}
)

/* api/v1/friendship/create_friendship?user_id=<user_id> */
router.post(
	'/create_friendship',
	passport.authenticate('jwt', { session: false }),
	createFriendship
)

/* api/v1/friendship/remove_friendship?user_id=<user_id> */
router.post(
	'/remove_friendship',
	passport.authenticate('jwt', { session: false }),
	removeFriendship
)

export default router
