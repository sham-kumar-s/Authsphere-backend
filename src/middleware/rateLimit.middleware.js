import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 60, // 15 minutes
    max: 5, // Attempts
    message: {
        message : "Too many login attempts. Try Again later" ,
    },
})