import express, { Router } from 'express'
import { doctorList, getDoctorById } from '../controllers/doctorController.js'
import { cacheMiddleware } from '../middlewares/authUser.js'

const doctorRouter=express.Router()

doctorRouter.get('/list', cacheMiddleware, doctorList)
doctorRouter.get('/:id',cacheMiddleware,getDoctorById)

export default doctorRouter