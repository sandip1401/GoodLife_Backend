import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  reportedAt: {
    type: Date,
    default: Date.now
  }
});

const donorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true
    },

    bloodGroup: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true,
      unique: true
    },

    available: {
      type: Boolean,
      default: true
    },

    reports: [reportSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Donor", donorSchema);