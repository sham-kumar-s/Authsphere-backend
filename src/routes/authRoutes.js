import express from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get(
  "/admin",
  authenticate,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

export default router;
