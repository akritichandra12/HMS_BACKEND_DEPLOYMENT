import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {User} from "../models/userSchema.js";
import {generateToken} from "../utils/jwtToken.js"
import cloudinary from "cloudinary"
export const patientRegister=catchAsyncErrors(async(req,res,next)=>{
    const{
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role,
    }= req.body;
    if(
        !firstName ||
        !lastName ||
        !email ||
        !phone ||  
        !password||      
        !gender || 
        !dob|| 
        !nic|| 
        !role
    ){
        return next(new ErrorHandler("Please fill the entire form!",400));
    }
    let user= await User.findOne({email}); //we check if this email is already registered in the db or not
    if(user){ //if yes then error is thrown
        return next(new ErrorHandler("User already registered!",400));
    }
    user =await User.create({firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role,});
        generateToken(user,"User registered!",200,res); //from utils
        //if everything is ok then this is displayed
});
//the code written below is for login of patients and admins
export const login=catchAsyncErrors(async(req,res,next)=>{
    const{email,password,confirmPassword,role}=req.body; //this is what is needed to login
    if(!email||!password||!confirmPassword||!role){
        return next(new ErrorHandler("Please provide all the details!",400));   //if everything is not entered
    }
    if(password!=confirmPassword){
        return next(new ErrorHandler("Password and Confirm Password do not match!",400)); //if pw is not matching the confirm pw
    } 
    const user=await User.findOne({email}).select("+password"); //now the user mail will be cross checked in the db, + in front of pw to make sure it is included as we are not allowed to do it kyuki select:false in schema
    if(!user){
        return next(new ErrorHandler("Invalid password or email!",400));
    } //if not found then this will be shown
    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid password or email!",400));
    } //compares password entered by user to hash password stored in db
  if(role!==user.role){
    return next(new ErrorHandler("User with this role not found!",400));
  } //if roles do not match
  generateToken(user,"Logged in successfully!",200,res);  //from utils
        //if everything is ok then this is displayed
});
//now to use this just like messagecontroller, we need to make a userrouter!
//new admin registry
export const addNewAdmin=catchAsyncErrors(async(req,res,next)=>{
    const{
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        
    }= req.body;  //parameters needed as input
    if(
        !firstName ||
        !lastName ||
        !email ||
        !phone ||  
        !password||      
        !gender || 
        !dob|| 
        !nic
    ){
        
        return next(new ErrorHandler("Please fill the entire form!",400));
    }
    const isRegistered=await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler( `${isRegistered.role} with this email already exists! `)); //this means patient or admin anybody with this mail who exists already. hence the statement
    }
    const admin=await User.create({firstName,lastName,email,phone,password,gender,dob,nic,role:"Admin"});
    res.status(200).json({
        success:true,
        message:"New admin registered!"
    })
    

});
//now we will GET doctors
export const getAllDoctors=catchAsyncErrors(async(req,res,next)=>{
const doctors=await User.find({role:"Doctor"}); //find all the ppl with roles of a doctor
res.status(200).json({
    success:true,
    doctors,  //displays all the doctors
});
});

//to GET all user details
export const getUserDetails=catchAsyncErrors(async(req,res,next)=>{ //we will first do authentication using this function
    const user=req.user;  //then we get the details
     
     res.status(200).json({
        success:true,
        user
     });
});
    
//logout
export const logoutAdmin=catchAsyncErrors(async(req,res,next)=>{
  res.status(200).cookie("adminToken","",{ //removing the adminToken cookie to log out
    httpOnly:true,
    expires:new Date(Date.now()),
    secure:true,
 sameSite:"None"
  }).json({
    success:true,
    message:"Admin logged out successfully!"
  });
});
export const logoutPatient=catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("patientToken","",{ //removing the adminToken cookie to log out
      httpOnly:true,
      expires:new Date(Date.now()),
      secure:true,
 sameSite:"None"
    }).json({
      success:true,
      message:"Patient logged out successfully!"
    });
  });
  //to add doctors
  export const addNewDoctor=catchAsyncErrors(async(req,res,next)=>{
    if(!req.files||Object.keys(req.files).length==0){
        return next(new ErrorHandler("Doctor Avatar Required!",400)); //if the avatar is not given or the length is 0
    }
    const {docAvatar}=req.files; //avatar is uploaded
    const allowedFormats=["image/png","image/jpeg","image/webp","image/jpg"]; //needs to be of one of these formats only
    if(!allowedFormats.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("File Format Not Supported!",400));
    }
    const{
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,  
        doctorDepartment
    }=req.body;
    if(
       (!firstName ||
        !lastName ||
        !email ||
        !phone ||  
        !password||      
        !gender || 
        !dob|| 
        !nic||
        !doctorDepartment ) //doc dept is a new field needed for docs
    )
    {
        return next(new ErrorHandler("Please provide full details",400));
    }
    const isRegistered=await User.findOne({email}); //email is taken to see if there is already anybody else who registered using the same mail
    if(isRegistered)
    {
        return next(new ErrorHandler(`${isRegistered.role} already registered with this mail!`,400));
    }
  //posting images on cloudinary
  const cloudinaryResponse=await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if(!cloudinaryResponse||cloudinaryResponse.error){
    console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error||"Unknown Cloudinary Error"
    );
    
  }
  const doctor=await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,  
    doctorDepartment,
    role:"Doctor",
    docAvatar:{
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
    }
  });
  res.status(200).json({
    success:true,
    message:"New Doctor Registered!",
    doctor
  })
});


