import { Router } from "express";
import { login, logout, me, refresh } from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { loginSchema } from "./auth.validator";
import { authLimiter, loginLimiter } from "../../middleware/rate-limit.middleware";

const router = Router();

router.post("/login", loginLimiter, validate(loginSchema), login);

router.post("/refresh", authLimiter, refresh);

router.post("/logout", logout);

router.get("/me", authenticate, me);

export default router;
