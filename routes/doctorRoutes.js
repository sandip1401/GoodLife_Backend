import express, { Router } from 'express'
import { cancelAppointment, completeAppointment, doctorList, getDoctorAppointments, getDoctorById, getDoctorProfile, loginDoctor } from '../controllers/doctorController.js'
import { cacheMiddleware } from '../middlewares/authUser.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter=express.Router()

doctorRouter.get("/list", cacheMiddleware, doctorList);
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("/profile", authDoctor, getDoctorProfile);

// ✅ FIRST define specific routes
doctorRouter.get("/appointments", authDoctor, getDoctorAppointments);
doctorRouter.post("/complete-appointment", authDoctor, completeAppointment);
doctorRouter.post("/cancel-appointment", authDoctor, cancelAppointment);

// ❗ ALWAYS keep dynamic route LAST
doctorRouter.get("/:id", cacheMiddleware, getDoctorById);


export default doctorRouter