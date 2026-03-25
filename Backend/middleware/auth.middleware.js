import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token and authenticate user.
 * Should be used on protected routes.
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Normalize user object
    // Make sure req.user.id is always defined, no matter how JWT was signed
    req.user = {
      id: decoded.id || decoded._id || decoded.user,
      email: decoded.email,
    };
  


    if (!req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token structure: user id missing." });
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Session expired. Please log in again." });
    }

    if (error.name === "JsonWebTokenError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid token. Authentication failed." });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error: error.message });
  }
};
