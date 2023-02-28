import express from "express";
import userRoutes from "./users.js"
const router = express.Router();

router.get("/", (req, res) => res.send("v1router loaded"));

router.use("/users",userRoutes)

export default router;
