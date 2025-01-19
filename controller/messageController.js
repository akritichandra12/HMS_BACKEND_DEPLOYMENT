import {catchAsyncErrors} from '../middlewares/catchAsyncErrors.js';
import {Message} from "../models/messageSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

export const sendMessage=catchAsyncErrors(async(req,res,next)=>{
    const {firstName,lastName,email,phone,message}=req.body; //these are the things that we need to GET
    if(!firstName||!lastName||!email||!phone||!message) //if one of these fields is missing it gives a prompt to enter everything
    {
        return next(new ErrorHandler("Please fill the entire form",400));
    }
    await Message.create({firstName,lastName,email,phone,message}); //everything is present so then message is sent
    res.status(200).json({
        success:true,
        message:"Message sent successfully!",
    });
})
 //now if everything is ok, the message is sent, toh uski functionality router mein deal karenge. create router

 //to get messages
 export const getAllMessages=catchAsyncErrors(async(req,res,next)=>{
    const messages=await Message.find();
    res.status(200).json({
        success:true,
        messages
    });
 });