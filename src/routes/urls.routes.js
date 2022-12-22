import { Router } from "express";
import {shortUrl} from "../controllers/urls.controllers.js"
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/urls/shorten", authenticate,shortUrl);

export default router;