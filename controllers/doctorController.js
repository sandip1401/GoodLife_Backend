import doctorModel from "../models/doctorModel.js"


const changeAvailablity=async(req,res)=>{
    try{
        const {docId}=req.body

        const docData=await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
        res.json({success:true, message:'Availability Changed'})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const doctorList=async(req,res)=>{
    try{
        const doctors=await doctorModel.find({available: true}).select('-password -email')
        res.json({success:true,doctors})
    }
    catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

const getDoctorById=async(req,res)=>{
    try{
        const {id}=req.params;

        const doctor=await doctorModel.findById(id)

        if(!doctor){
            return res.status(404).json({
                success:false,
                message:"Doctor not found"
            })
        }
        res.status(200).json({
            success:true,
            doctor,
        })
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            message:"Failed to fetch doctor"
        })
    }
}


export {changeAvailablity,doctorList,getDoctorById}