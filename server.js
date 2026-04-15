import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import doctorRouter from "./routes/doctorRoutes.js";
import clinicRouter from "./routes/clinicRoutes.js";
import helmet from "helmet";

const app = express();
dotenv.config();
connectDB();
connectCloudinary();
const port = process.env.PORT || 4000;

//middlewares
app.use(express.json());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],

        fontSrc: ["'self'", "https://fonts.gstatic.com"],

        connectSrc: [
          "'self'",
          "https://goodlife-backend-xb3b.onrender.com",
          "https://www.google-analytics.com",
          "https://analytics.google.com",
        ],

        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://www.googletagmanager.com",
        ],
      },
    },
  }),
);

app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/clinic", clinicRouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(port, () => console.log("server started on port ", port));
