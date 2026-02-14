import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, gender, age } = req.body;

    // 🔹 Validation
    if (!name || !email || !password || !phone || !gender || !age) {
      return res.json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    // 🔹 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      gender,
      age,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};



const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.userId; // coming from auth middleware

    if (!docId || !slotDate || !slotTime) {
      return res.json({
        success: false,
        message: "Missing appointment details",
      });
    }

    const doctor = await doctorModel.findById(docId).select("-password");
    const user = await userModel.findById(userId).select("-password");

    if (!doctor) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }
    if (!user) {
      return res.json({
        success: false,
        message: "user not found",
      });
    }

    if (!doctor.slots_booked) {
      doctor.slots_booked = {};
    }

    if (!doctor.slots_booked[slotDate]) {
      doctor.slots_booked[slotDate] = [];
    }

    const timeOnly = slotTime;
    const isbooked =
      doctor?.slots_booked?.[slotDate]?.includes(timeOnly) || false;
    if (isbooked) {
      return res.json({
        success: false,
        message: "This time slot is already booked",
      });
    }

    doctor.slots_booked[slotDate].push(timeOnly);

    doctor.markModified("slots_booked");
    await doctor.save();

    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime: timeOnly,
      userData: user, // OBJECT
      docData: doctor, // OBJECT
      amount: doctor.fees,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    res.json({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const myAppointments = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("USER ID FROM TOKEN:", req.userId);
    let appointments = await appointmentModel
      .find({ userId })
      .populate("docId", "-password")
      .sort({ date: -1 });

    //     if (!appointments || appointments.length === 0) {
    //   return res.json({
    //     success: true,
    //     appointments: [],
    //   });
    // }
    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId;

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
    if (appointment.userId.toString() !== userId) {
      return res.json({
        success: false,
        message: "Unauthorized",
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

//create payment order
const createPaymentorder = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment ID required" });
    }

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    if (appointment.payment) {
      return res
        .status(400)
        .json({ success: false, message: "Payment already done" });
    }

    const options = {
      amount: appointment.amount * 100,
      currency: "INR",
      receipt: `recipt_${appointmentId}`,
    };
    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//verify order

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentId,
    } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing payment details" });
    }
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      payment: true,
      razorpay_order_id,
      razorpay_payment_id,
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  bookAppointment,
  myAppointments,
  cancelAppointment,
  createPaymentorder,
  verifyPayment,
  getUserProfile
};
