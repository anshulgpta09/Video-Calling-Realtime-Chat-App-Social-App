import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken, syncAllUsersWithStream } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);
router.post("/sync-users", protectRoute, syncAllUsersWithStream);

export default router;
