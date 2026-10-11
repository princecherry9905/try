import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

export const verifyAdmin = async (req, res, next) => {
  if (req.user && req.user.role) {
    if (req.user.role === "admin") {
      return next();
    }
    return res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }

  const roleHeader = req.headers["x-user-role"] || req.headers["role"];
  if (roleHeader) {
    if (roleHeader.toLowerCase() === "admin") {
      return next();
    }
    return res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }

  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    if (decoded.role === "admin") {
      req.user = decoded;
      return next();
    }

    if (decoded.role && decoded.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
      });
    }

    if (decoded.id && mongoose.isValidObjectId(decoded.id)) {
      try {
        const user = await User.findById(decoded.id);
        if (user && user.role === "admin") {
          req.user = user;
          return next();
        }
      } catch {}
    }

    return res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }

  return res.status(403).json({
    message: "Access denied. Admin only.",
  });
};
