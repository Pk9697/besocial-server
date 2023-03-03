import express from "express";
import passport from "passport"
import passportJWT from "../../../config/passport-jwt-strategy.js"
import { createPost,deletePost,getAllPosts } from "../../../controllers/api/v1/posts.js";

const router = express.Router();
/* /api/v1/posts/create */
router.post("/create",passport.authenticate('jwt',{session:false}),createPost)
/* /api/v1/posts/ */
router.get("/",getAllPosts)
/* /api/v1/posts/delete/:postId */
router.delete("/delete/:postId",passport.authenticate('jwt',{session:false}),deletePost)

export default router;
