import express from "express";
import passport from "passport"
import passportJWT from "../../../config/passport-jwt-strategy.js"
import { register,login, getUserProfile, updateOwnProfile } from "../../../controllers/api/v1/users.js";

const router = express.Router();

/* /api/v1/users/register */
router.post("/register",register)
/* /api/v1/users/login */
router.post("/login",login)
/* /api/v1/users/profile/:userId */
router.get("/profile/:userId",passport.authenticate('jwt',{session:false}),getUserProfile)
/* /api/v1/users/update/:userId */
router.post("/update/:userId",passport.authenticate('jwt',{session:false}),updateOwnProfile)
//strategy to be given is jwt with session as false so that session cookies are not generated
//authentication check
//If authentication is successful, the user will be logged in and populated at req.user and 
//a session will be established by default. If authentication fails, an unauthorized response will be sent.
router.get("/test",passport.authenticate('jwt',{session:false}),(req,res)=>res.status(200).json({success:true}))

export default router;
