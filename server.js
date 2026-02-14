import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import doctorRouter from "./routes/doctorRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Connect to Cloudinary
connectCloudinary();

// Allowed frontends
const allowedOrigins = [
  "https://goodlife.vercel.app",
  "https://admin-good-life.vercel.app"
];

// Middlewares
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: function(origin, callback){
    // Allow requests with no origin (like Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);

// Test route
app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Something went wrong!" });
});

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`));
