import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    // 1️⃣ Read token from Authorization OR custom dToken
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      console.log("From Authorization Header");
      token = authHeader.split(" ")[1];
    } else if (req.headers.dtoken) {
      console.log("From dToken Header");
      token = req.headers.dtoken;
    }

    // 2️⃣ If no token
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized — token missing",
      });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    // 4️⃣ Set doctor id
    req.docId = decoded.id;

    next();
  } catch (error) {
    console.log("ERROR:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default authDoctor;