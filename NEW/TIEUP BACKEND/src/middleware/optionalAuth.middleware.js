import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const optionalAuth = asyncHandler(async (req, res, next) => {
  try {
    // Get token from cookies or headers
    const rawAuthHeader = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken;
    const headerToken = rawAuthHeader && rawAuthHeader.startsWith("Bearer ")
      ? rawAuthHeader.split(" ")[1]
      : null;

    const token = cookieToken || headerToken;

    // If no token, proceed as guest
    if (!token) {
      req.user = null; // Explicitly set req.user to null for guest users
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded?.id) {
      req.user = null; // Invalid token, treat as guest
      return next();
    }

    // Fetch user and exclude sensitive fields
    const user = await User.findById(decoded.id).select("-password -refreshToken");

    if (!user) {
      req.user = null; // User not found, treat as guest
      return next();
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    // If token verification fails, proceed as guest
    console.error("Optional Authentication Error:", error);
    req.user = null;
    next();
  }
});

export { optionalAuth };