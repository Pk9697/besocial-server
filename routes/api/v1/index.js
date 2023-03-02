import express from "express";
import userRoutes from "./users.js"
import postRoutes from "./posts.js"

const router = express.Router();

router.get("/", (req, res) => res.send("v1router loaded"));

router.use("/users",userRoutes)
router.use("/posts",postRoutes)

export default router;
