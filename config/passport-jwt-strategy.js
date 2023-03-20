import passport from 'passport'
import passportJWT from 'passport-jwt'
import User from '../models/user.js'

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const opts = {
	jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('Bearer'),
	secretOrKey: 'besocial',
}

passport.use(
	new JWTStrategy(opts, async function (jwtPayload, done) {
		// here User. any methods does not support callback fxns anymore so use async await for that
		try {
			const user = await User.findOne({ _id: jwtPayload._id })
			if (user) {
				return done(null, user)
			} else {
				return done(null, false)
			}
		} catch (err) {
			if (err) {
				console.log('Error in finding user from JWT')
				return
			}
		}
		// User.findOne({id: jwtPayload._id},function(err,user){
		//     if(err){
		//         console.log('Error in finding user from JWT')
		//         return
		//     }

		//     if(user){
		//         return done(null,user)
		//     }else{
		//         return done(null,false)
		//     }
		// })
	})
)

export default passport
