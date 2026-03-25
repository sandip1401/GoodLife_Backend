import clinicModel from "../models/clinicModel.js";
import doctorModel from "../models/doctorModel.js";
import { v2 as cloudinary } from "cloudinary";

// ADMIN CREATE CLINIC
const createClinic = async (req, res) => {
  try {
    const { name, address, city, pincode, offer } = req.body;
    const imageFile = req.file;

    if (!name || !address || !city || !pincode ||!offer) {
      return res.json({
        success: false,
        message: "Missing clinic details"
      });
    }

    let existingClinic = await clinicModel.findOne({
      name: { $regex: new RegExp("^" + name + "$", "i") }
    });

    if (existingClinic) {
      return res.json({
        success: false,
        message: "Clinic already exists"
      });
    }

    let imageUrl = "";

    if (imageFile) {
      const upload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image"
      });
      imageUrl = upload.secure_url;
    }

    const clinic = new clinicModel({
      name,
      image: imageUrl,
      address,
      city,
      offer,
      pincode
    });

    await clinic.save();

    res.json({
      success: true,
      message: "Clinic created successfully",
      clinic
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
};



// SEARCH CLINIC (for admin search input)
const searchClinic = async (req, res) => {
  try {
    const { name } = req.query;

    const clinics = await clinicModel.find({
      name: { $regex: name, $options: "i" }
    }).limit(10);

    res.json({
      success: true,
      clinics
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL CLINICS (for patient button "Show Clinics")
const getAllClinics = async (req, res) => {
  try {
    const clinics = await clinicModel.find({}).sort({ name: 1 });

    const clinicsWithDoctorCount = await Promise.all(
      clinics.map(async (clinic) => {
        const doctorCount = await doctorModel.countDocuments({
          clinicId: clinic._id
        });

        return {
          ...clinic._doc,
          doctorCount
        };
      })
    );

    res.json({
      success: true,
      clinics: clinicsWithDoctorCount
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
};

// GET DOCTORS BY CLINIC (patient view)
const getDoctorsByClinic = async (req, res) => {
  try {
    const { clinicId } = req.params;

    const doctors = await doctorModel
      .find({ clinicId })
      .select("-password");

    res.json({
      success: true,
      doctors
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
};

export { searchClinic, getAllClinics, getDoctorsByClinic, createClinic };