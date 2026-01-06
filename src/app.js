import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import usersRoutes from "./routes/users.routes.js"

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRoutes);
app.use("/api/users",usersRoutes)

export default app;
