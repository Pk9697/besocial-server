import express from "express";

const router = express.Router();

router.get("/", (req, res) => res.send("v1router loaded"));

export default router;
