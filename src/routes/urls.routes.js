import { Router } from "express";
import {shortUrl, showUrl} from "../controllers/urls.controllers.js"
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/urls/shorten", authenticate,shortUrl);
router.get("/urls/:id", showUrl);

export default router;