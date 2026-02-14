import mongoose from "mongoose";

const weeklyAvailabilitySchema = new mongoose.Schema({
  day: { type: String, required: true },          // Monday
  startTime: { type: String, required: true },    // 11:00
  endTime: { type: String, required: true }       // 13:00
});

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address1: { type: String, required: true },
    address2: { type: String, required: true },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    managerContacts: [
    {
      type: String,
    },
  ],

    // ✅ NEW FIELD
    weeklyAvailability: {
      type: [weeklyAvailabilitySchema],
      default: []
    }
  },
  { minimize: false }
);

const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

export default doctorModel;
