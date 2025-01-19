//as we saw on postman, that on sending wrong values, the server was crashing and the errors were not being handled properly. to fix that, middleware folder is created.
export const catchAsyncErrors=(theFunction)=>{
    return(req,res,next)=>{
        Promise.resolve(theFunction(req,res,next)).catch(next);
    };
};

//Executes the given function (theFunction) with req, res, and next.
//Wraps it in Promise.resolve() to catch any errors that might occur during execution.
//If an error occurs, it automatically calls next(error) so that the error is passed to your error-handling middleware.
