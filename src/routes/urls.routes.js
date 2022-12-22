import { Router } from "express";
import {shortUrl, showUrl, openUrl, deleteUrl, showUserUrls} from "../controllers/urls.controllers.js"
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/urls/shorten", authenticate,shortUrl);
router.get("/urls/:id", showUrl);
router.get("/urls/open/:shortUrl", openUrl);
router.delete("/urls/:id",authenticate, deleteUrl);
router.get("/users/me",authenticate, showUserUrls);

export default router;