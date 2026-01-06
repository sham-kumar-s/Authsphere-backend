import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/users/me

router.get("/me",authenticate,(req,res) => {
    res.json({
        id:req.user.id,
        role:req.user.role
    })
})

export default router;