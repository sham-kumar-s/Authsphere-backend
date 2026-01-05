import express from "express";
import { signup, login,refreshToken, logout } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { loginLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login,loginLimiter);
router.post("/refresh",refreshToken,loginLimiter)
router.post("/logout",logout)

// GET /api/users/me
router.get("/me", authenticate, (req, res) => {
  res.json({
    id: req.user.id,
    role: req.user.role,
  });
});

router.get(
  "/admin",
  authenticate,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

export default router;
