import express, { Router } from 'express'
import { doctorList, getDoctorById } from '../controllers/doctorController.js'


const doctorRouter=express.Router()

doctorRouter.get('/list',doctorList)
doctorRouter.get('/:id',getDoctorById)

export default doctorRouter