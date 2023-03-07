import express from "express";
import userRoutes from "./users.js"
import postRoutes from "./posts.js"
import commentRoutes from "./comments.js"
import likeRoutes from "./likes.js"
import friendshipRoutes from "./friendships.js"
const router = express.Router();

router.get("/", (req, res) => res.send("v1router loaded"));

router.use("/users",userRoutes)
router.use("/posts",postRoutes)
router.use("/comments",commentRoutes)
router.use("/likes",likeRoutes)
router.use("/friendships",friendshipRoutes)

export default router;
