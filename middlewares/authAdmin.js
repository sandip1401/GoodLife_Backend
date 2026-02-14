import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    // 1️⃣ Read token from either Authorization header OR custom atoken header
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        console.log("first")
      token = authHeader.split(" ")[1];
    } else if (req.headers.atoken) {
        console.log("2")
      token = req.headers.atoken;
    }

    // 2️⃣ If still no token
    if (!token) {
      return res.json({ success: false, message: "Not Authorized — token missing" });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Validate against admin credentials
    if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({ success: false, message: "Not Authorized — invalid token" });
    }

    next();
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

export default authAdmin;
