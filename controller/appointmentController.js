import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {Appointment} from "../models/appointmentSchema.js";
import {User} from "../models/userSchema.js";
//for users to make and post appointments
export const postAppointment=catchAsyncErrors(async(req,res,next)=>{
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstName,
        doctor_lastName,
        hasVisited,
        address,
    }=req.body;
    if( !firstName||
        !lastName||
        !email||
        !phone||
        !nic||
        !dob||
        !gender||
        !appointment_date||
        !department||
        !doctor_firstName||
        !doctor_lastName||
       !address){
            return next(new ErrorHandler("Pease fill the entire form!",400));
        }
        const isConflict=await User.find({
            firstName: doctor_firstName,
            lastName:doctor_lastName,
            role:"Doctor",
            doctorDepartment:department //take the details and find the doctor in db
        })
        if(isConflict.length==0)
        {
            return next(new ErrorHandler("Doctor not found!",404));
        }
        if(isConflict.length>1)
            {
                return next(new ErrorHandler("Doctor's Conflict!Please contact through email or phone",404));
            } //this is if more than one doctor of the same name dept etc are found
     const doctorId=isConflict[0]._id;
     const patientId=req.user._id;
     const appointment=await Appointment.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor:{
            firstName:doctor_firstName,
            lastName:doctor_lastName
        },
        hasVisited,
        address,
        doctorId,
        patientId
     });
     res.status (200).json({
        success:true,
        message:"Appointment sent successsfully!",
        appointment
        });

});
export const getAllAppointments=catchAsyncErrors(async(req,res,next)=>{
    const appointments=await Appointment.find();
    res.status(200).json({
        success:true,
        appointments,
    });  //ye appointments admin dekhega
});

//to change appointment status
export const updateAppointmentStatus=catchAsyncErrors(async(req,res,next)=>{
    const {id}=req.params; //get the id pf the appointment whose status the admins wish to update
    let appointment=await Appointment.findById(id);
    if(!appointment){
        return next(new ErrorHandler("Appointment not found!",404));
    }
  appointment=await Appointment.findByIdAndUpdate(id,req.body, {
     new:true,
     runValidators:true,
     useFindAndModify: false,
  });
  res.status(200).json({
    success:true,
    message:"Appointment Status Updated!",
    appointment,
  });
});

//deleting appointments
export const deleteAppointment=catchAsyncErrors(async(req,res,next)=>{
    const {id}=req.params;
    let appointment=await Appointment.findById(id);
    if(!appointment){
        return next(new ErrorHandler("Appointment not found!",404));
    }
    await appointment.deleteOne();
    res.status(200).json({
        success:true,
        message:"Appointment Deleted!"
    });
});