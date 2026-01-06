import bcrypt from "bcrypt";
import User from "../models/User.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashedPassword,
  });

  res.status(201).json({ message: "User created" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.sendStatus(401);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.sendStatus(401);

  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user._id,
  });

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // res.json({ accessToken, refreshToken });
  res.json({ accessToken });
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  const user = await User.findOne({ refreshToken });
  if (!user) return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, decoded) => {
      if (err) return res.sendStatus(403);

      // Rotate Token
      const newAccessToken = generateAccessToken({
        id: user._id,
        role: user.role,
      });

      const newRefreshToken = generateRefreshToken({
        id: user._id,
      });

      user.refreshToken = newRefreshToken;
      await user.save();

      // 🔁 rotate cookie
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    }
  );
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const user = await User.findOne({ refreshToken });

    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "none",
    secure: false,
  });

  res.json({ message: "Logged out" });
};
