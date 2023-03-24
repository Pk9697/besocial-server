import express from 'express'
import userRoutes from './users.js'
import postRoutes from './posts.js'
import commentRoutes from './comments.js'
import likeRoutes from './likes.js'
import friendshipRoutes from './friendships.js'
import passport from 'passport'
import passportJWT from '../../../config/passport-jwt-strategy.js'
const router = express.Router()

router.get(
	'/authenticate-user',
	passport.authenticate('jwt', { session: false, failWithError: true }),
    (req,res)=>{
        return res.status(200).json({
            success:true,
            message:"User Authenticated"
        })
    },
    (err,req,res,next)=>{
        return res.status(422).json({
			success:false,
            message:"User Authentication Failed! Logging Out"
		})
    }
)

router.use('/users', userRoutes)
router.use('/posts', postRoutes)
router.use('/comments', commentRoutes)
router.use('/likes', likeRoutes)
router.use('/friendship', friendshipRoutes)

export default router
