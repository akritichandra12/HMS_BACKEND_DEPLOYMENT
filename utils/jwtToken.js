//utils file has been created for cookies generation for authorization/authentication
export const generateToken=(user,message,statusCode,res)=>{   //these parameters can be anything of your choice
 const token=user.generateJsonWebToken(); //cookie generation
 const cookieName=user.role=="Admin"?"adminToken":"patientToken" //Assigning token names based on roles
 res.status(statusCode).cookie(cookieName,token,{
    expires:new Date(Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000),//expires in 7 days
 httpOnly:true,
 secure:true,
 sameSite:"None"
   }).json({
    success:true,
    message,
    user,
    token  //these are the responses that are being sent
 })
};

