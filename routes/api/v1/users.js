import express from "express";
import passport from "passport"
import passportJWT from "../../../config/passport-jwt-strategy.js"
import { register,login } from "../../../controllers/api/v1/users.js";

const router = express.Router();

/* /api/v1/users/register */
router.post("/register",register)
/* /api/v1/users/login */
router.post("/login",login)

router.get("/test",passport.authenticate('jwt',{session:false}),(req,res)=>res.status(200).json({success:true}))

export default router;
