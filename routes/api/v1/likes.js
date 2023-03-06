import express from "express";
import passport from "passport"
import passportJWT from "../../../config/passport-jwt-strategy.js"
import { toggleLike } from "../../../controllers/api/v1/likes.js";

const router = express.Router();
/* api/v1/likes/toggle/?id=efnksk&type=Post */
router.post("/toggle",passport.authenticate('jwt',{session:false}),toggleLike)

export default router;
