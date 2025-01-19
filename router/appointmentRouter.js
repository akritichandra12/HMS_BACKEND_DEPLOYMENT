import express from "express";
import { deleteAppointment, getAllAppointments, postAppointment, updateAppointmentStatus } from "../controller/appointmentController.js";
import {isAdminAuthenticated,isPatientAuthenticated} from "../middlewares/auth.js"
const router=express.Router();
router.post("/post",isPatientAuthenticated,postAppointment); //patients can make appointments
router.get("/getall",isAdminAuthenticated,getAllAppointments); //to see all the appointments (admin will see)
router.put("/update/:id",isAdminAuthenticated,updateAppointmentStatus); //to update the appt status (admin will do it) we use put
router.delete("/delete/:id",isAdminAuthenticated,deleteAppointment); //to delete the appt
export default router;
