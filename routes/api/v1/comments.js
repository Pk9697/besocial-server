import express from "express";
import passport from "passport"
import passportJWT from "../../../config/passport-jwt-strategy.js"
import { createComment } from "../../../controllers/api/v1/comments.js";

const router = express.Router();
/* /api/v1/comments/create */
router.post("/create",passport.authenticate('jwt',{session:false}),createComment)

export default router;