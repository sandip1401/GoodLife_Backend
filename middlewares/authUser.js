import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({
        success: false,
        message: "Not authorized",
      });
    }

    // Extract token safely
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach userId to request
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authUser;
