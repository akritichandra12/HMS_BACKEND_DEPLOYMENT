//for patients' entry
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        minLength:[3,"First name must contain at least 3 characters"],
        
    },
    lastName:{
        type:String,
        required: true,
        minLength:[3,"Last name must contain at least 3 characters"],
    },
        
    email:{
        type:String,
        required: true,
        validate:[validator.isEmail,"Please provide a valid email"],
    },
    phone:{
        type:String,
        required: true,
        minLength:[10,"Phone number must contain exact 10 digits"],
        maxLength:[10,"Phone number must contain exact 10 digits"],
    },
    nic:{
        type:String,
        required: true,
        minLength:[12,"NIC must contain exact 12 digits"],
        maxLength:[12,"NIC must contain exact 12 digits"],
    },
    dob:{
      type: Date,
      required: [true,"DOB is required!"],
    },
    gender:{
        type:String,
        required:true,
        enum:["Male","Female"],
    },
    password:{
        type:String,
        minLength: [8,"Password must contain at least 8 characters!"],
        required: true,
        select:false, //because we dont want this to get selected and saved directly due to security reasons
    },
    
    role:{
        type:String,
        required:true,
        enum:["Admin","Patient","Doctor"],  //what are you registering as
    },
    doctorDepartment:{
        type:String,     //dept of doctor
    },
    docAvatar:{
      public_id:String,
      url: String,       
    },

});
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
}); //this function stores the password in hashed form so that it remains private and only known to the user.

userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}; //this function is to check if the password input by the user is equal to the hashed version of it when they login

userSchema.methods.generateJsonWebToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES,
    }); //gives ids to ppl whi register
};


export const User=mongoose.model("User",userSchema);