console.log("cloud1")
import {v2 as cloudinary} from 'cloudinary'
import dotenv from "dotenv";
console.log("cloud1")
dotenv.config();
const connectCloudinary=async()=>{
    console.log("cloud")
    cloudinary.config({
        cloud_name:process.env.CLOUDINARY_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET
    })
}
export default connectCloudinary