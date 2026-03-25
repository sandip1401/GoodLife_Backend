import express from "express";
import multer from "multer";
import {
  searchClinic,
  getAllClinics,
  getDoctorsByClinic,
  createClinic
} from "../controllers/clinicController.js";

const clinicRouter = express.Router();
const upload = multer({ dest: "uploads/" });

// ADMIN ADD CLINIC
clinicRouter.post("/add", upload.single("image"), createClinic);

// admin search clinic
clinicRouter.get("/search", searchClinic);

// show all clinics
clinicRouter.get("/list", getAllClinics);

// doctors of a clinic
clinicRouter.get("/doctors-by-clinic/:clinicId", getDoctorsByClinic);

export default clinicRouter;