import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import {errorMiddleware} from './middlewares/errorMiddleware.js'
import userRouter from "./router/userRouter.js"
import appointmentRouter from "./router/appointmentRouter.js"
const app=express();
config({ path: "./config/config.env"});

app.use(
    cors({
        origin:[process.env.FRONTEND_URL,process.env.DASHBOARD_URL],
        methods:["GET","POST","PUT","DELETE"],
        credentials:true,
    }

    )
);
//below mentioned thingd are called middlewares
app.use(cookieParser()); //to get cookies
app.use(express.json()); //data in json format; to pass that in string
app.use(express.urlencoded({extended:true})) //to recognise data eg name,date etc(for eg the details that we fill while taking appt)
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir: "/tmp/",

}));
app.use("/api/v1/message",messageRouter); //used for post/get
app.use("/api/v1/user",userRouter); //(used for post/get)
app.use("/api/v1/appointment",appointmentRouter);
dbConnection(); //connected the database
app.use(errorMiddleware);
export default app;


