// to deal with what happens when the message is good to go
import express from "express";
import {getAllMessages, sendMessage} from "../controller/messageController.js";
import {isAdminAuthenticated} from "../middlewares/auth.js"

const router=express.Router();
router.post("/send",sendMessage); //post because we are sending the message. 1st parameter is the syntax and 2nd is the fuction that will be called while sending the message(from messagecontroller.js file)
router.get("/getall",isAdminAuthenticated,getAllMessages); //an authenticated admin will be able to view all the messages
export default router; 
