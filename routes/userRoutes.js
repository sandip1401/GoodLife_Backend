import express, { Router } from 'express'
import { bookAppointment, cancelAppointment, createPaymentorder, getUserProfile, loginUser, myAppointments, registerUser, verifyPayment,reportDonor, addDonor, listDonors, updateDonorAvailability } from '../controllers/userController.js'
import {authUser} from '../middlewares/authUser.js'


const userRouter=express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.get("/my-appointments",authUser,myAppointments)
userRouter.get("/my-profile",authUser,getUserProfile)
userRouter.get("/donor-list",listDonors)
userRouter.post("/report",authUser,reportDonor)
userRouter.put("/update-availability",authUser,updateDonorAvailability)
userRouter.post("/add-donor",authUser,addDonor)
userRouter.post('/payment/create-order',authUser,createPaymentorder)
userRouter.post('/payment/verify',authUser,verifyPayment)


export default userRouter