import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check doctor exists
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // create token
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel
      .find({ available: true })
      .select("-password -email");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await doctorModel.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch doctor",
    });
  }
};

const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.docId).select("-password");
    if (!doctor) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }
    res.json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    if (!req.docId) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    const appointments = await appointmentModel
      .find({ docId: req.docId })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });

    res.json({
      success: true,
      message: "Appointment Completed",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    res.json({
      success: true,
      message: "Appointment Cancelled",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  changeAvailablity,
  doctorList,
  getDoctorById,
  loginDoctor,
  getDoctorProfile,
  getDoctorAppointments,
  completeAppointment,
  cancelAppointment,
};
