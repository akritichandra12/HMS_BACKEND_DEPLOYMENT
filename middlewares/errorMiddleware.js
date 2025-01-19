class ErrorHandler extends Error{ //class allows you to create custom errors and codes
    constructor(message,statusCode){ //message is what the user has written 
        super(message);
        this.statusCode=statusCode; //status code is what we have created
    }
}

//why class not function here?
//because this is not react(where functional component is prevelant now)
//but a class named error exists in js which can be used still. hence.

export const errorMiddleware=(err,req,res,next)=>
{
    err.message=err.message || "Internal Server Error"; //if apt message is present then that is displayed else the other half
    err.statusCode=err.statusCode|| 500; //same as above

    if(err.code==11000)
    {
        const message='Duplicate ${Object.keys(err.keyValue)} Entered';
        err=new ErrorHandler(message,400); //if you try to register using an email id that is already there in the db
    }
    if(err.name=="JsonWebTokenError"){
        const message="Json web token is expired, try again!";
        err=new ErrorHandler(message,400); //when the web token is expired
    }
    if(err.name=="CastError")
    {
        const message='Invalid ${err.path}';
        err=new ErrorHandler(message,400); //when invalid id or path is used
    }
    const errorMessage=err.errorMessage
    ?Object.values(err.errors)
    .map((error)=>error.message)
    .join(" ")
    :err.message;  //line 31 to 35 is to display not the code part but only the necessary part of the prompt when an error is thrown(eg:when putting wrong mails etc. the prompt should only display what the user needs to see)
    return res.status(err.statusCode).json({ 
        success:false,
        message:err.message, //returns a json response to show the failure and message associated with it
    });  

};
export default ErrorHandler;