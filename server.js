import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import doctorRouter from "./routes/doctorRoutes.js";

const app = express();
dotenv.config();
connectDB();
connectCloudinary();
const port = process.env.PORT || 4000;

//middlewares
app.use(express.json());
app.use(cors({
  origin: [
    "https://goodlife.vercel.app/",
  ],
  credentials: true
}));


app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)
app.use('/api/doctor',doctorRouter)

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(port, () => console.log("server started on port ", port));
