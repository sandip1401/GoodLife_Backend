import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: String,
  offer: String,
  address: String,
  city: String,
  pincode: String,
  createdAt: { type: Date, default: Date.now }
});

const clinicModel =
  mongoose.models.clinic || mongoose.model("clinic", clinicSchema);

export default clinicModel;