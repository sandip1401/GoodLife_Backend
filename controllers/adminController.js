import validator from "validator"
import bcrypt from 'bcrypt'
import doctorModel from "../models/doctorModel.js"
import { v2 as cloudinary } from "cloudinary"
import jwt from 'jsonwebtoken'
import connectCloudinary from "../config/cloudinary.js"
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"

const addDoctor=async(req,res)=>{
    try{
        let {name,email,password,speciality,degree, experience,about,fees,address1,address2,weeklyAvailability,managerContacts}=req.body
        const imageFile=req.file

        if (weeklyAvailability) {
            weeklyAvailability = JSON.parse(weeklyAvailability);
        }

        if(!name||!email||!password||!speciality||!degree||!experience||!about||!fees||!weeklyAvailability||!managerContacts){
            return res.json({success:false,message:"Missing Details"})
        }
        //vaildating email format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message:"Please enter strong password"})
        }

        let parsedManagers = managerContacts;
        if (typeof managerContacts === "string") {
         parsedManagers = JSON.parse(managerContacts);
        }

        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl=imageUpload.secure_url

        const doctorData={
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address1:address1,
            address2:address2,
            weeklyAvailability,
            managerContacts: parsedManagers,
            date:Date.now()
        }
        const newDoctor=new doctorModel(doctorData)
        await newDoctor.save();
        res.json({success:true, message:"Doctor Added Successfully"})
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:err.message})
    }
}


//login
const loginAdmin=async(req,res)=>{
    try{
        const {email,password}=req.body
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token=jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid credentials"})
        }
    }
    catch(err){
        console.log(err);
        res.json({success:false,message:err.message})
    }
}

const allDoctors=async(req,res)=>{
    try{
        const doctors=await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:err.message})
    }
}

const appointmentsAdmin=async(req,res)=>{
    try{
        const appointments=await appointmentModel.find({});
        res.json({success:true, appointments})
    }
    catch(error){
        console.log(err)
        res.json({success:false,message:err.message})
    }
}


const AdmincancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.json({
        success: false,
        message: "Appointment ID required",
      });
    }

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }
    

    appointment.cancelled = true;
    await appointment.save();
    const doctor = await doctorModel.findById(appointment.docId);
    if (!doctor) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }
    if (doctor.slots_booked?.[appointment.slotDate]) {
      doctor.slots_booked[appointment.slotDate] = doctor.slots_booked[
        appointment.slotDate
      ].filter((t) => t !== appointment.slotTime);
      if (doctor.slots_booked[appointment.slotDate].length === 0) {
        delete doctor.slots_booked[appointment.slotDate];
      }
    }

    doctor.markModified("slots_booked");
    await doctor.save();

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminDashboard=async(req,res)=>{
    try{
        const doctor= await doctorModel.find({})
        const users=await userModel.find({})
        const appointments=await appointmentModel.find({})

        const dashData={
            doctors:doctor.length,
            appointments:appointments.length,
            patients:users.length

        }
        res.json({success:true,dashData})
    }
    catch(error){
        console.log(error);
        res.json({ success: false, message: error.message });
  }
    }


const getAllPatients=async(req,res)=>{
    try{
        const patients=await userModel.find().select(
            "name email phone image"
        )
        res.json({
            success:true,
            patients
        })
    }
    catch(error){
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


export {addDoctor,loginAdmin,allDoctors, appointmentsAdmin,AdmincancelAppointment,adminDashboard,getAllPatients}