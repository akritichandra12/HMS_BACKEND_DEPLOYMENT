import {User} from "../models/userSchema.js";
import {catchAsyncErrors} from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";
//this is both authentication and authorization
export const isAdminAuthenticated=catchAsyncErrors(async(req,res,next)=>{
    const token=req.cookies.adminToken; //call for the admin token specifically 
    if(!token){
        return next(new ErrorHandler("Admin not authenticated!",400));
    } //if not an admin token
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY); //if the token is verified, find the user by the id alloted
    req.user=await User.findById(decoded.id);
    if(req.user.role!=="Admin") //if the user is anything other than the admin, access will be denied
    {
        return next(
            new ErrorHandler(
                `${req.user.role} not authorised for this resource!`,403

            )
        );
    }
    next();
});
//same for patient
export const isPatientAuthenticated=catchAsyncErrors(async(req,res,next)=>{
    const token=req.cookies.patientToken; //call for the admin token specifically 
    if(!token){
        return next(new ErrorHandler("Patient not authenticated!",400));
    } //if not an admin token
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY); //if the token is verified, find the user by the id alloted
    req.user=await User.findById(decoded.id);
    if(req.user.role!=="Patient") //if the user is anything other than the admin, access will be denied
    {
        return next(
            new ErrorHandler(
                `${req.user.role} not authorised for this resource!`,403

            )
        );
    }
    next();
});
 