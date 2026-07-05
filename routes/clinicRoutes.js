import express from "express";
import multer from "multer";
import {
  searchClinic,
  getAllClinics,
  getDoctorsByClinic,
  createClinic,
  getClinicById,
  updateClinic,
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

// update clinic
clinicRouter.post("/update/:clinicId", upload.single("image"), updateClinic);

// get clinic details by id
clinicRouter.get("/:clinicId", getClinicById);

export default clinicRouter;