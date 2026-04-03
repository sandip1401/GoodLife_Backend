import express from "express";
import multer from "multer";
import {
  searchClinic,
  getAllClinics,
  getDoctorsByClinic,
  createClinic
} from "../controllers/clinicController.js";
import { cacheMiddleware } from '../middlewares/authUser.js'


const clinicRouter = express.Router();
const upload = multer({ dest: "uploads/" });

// ADMIN ADD CLINIC
clinicRouter.post("/add", upload.single("image"), createClinic);

// admin search clinic
clinicRouter.get("/search",cacheMiddleware, searchClinic);

// show all clinics
clinicRouter.get("/list",cacheMiddleware, getAllClinics);

// doctors of a clinic
clinicRouter.get("/doctors-by-clinic/:clinicId",cacheMiddleware, getDoctorsByClinic);

export default clinicRouter;