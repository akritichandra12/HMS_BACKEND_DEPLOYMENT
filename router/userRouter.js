import express from "express"
import { addNewAdmin,login,patientRegister,getAllDoctors, getUserDetails, logoutAdmin,logoutPatient,addNewDoctor} from "../controller/userController.js";
import { isAdminAuthenticated,isPatientAuthenticated } from "../middlewares/auth.js";
const router=express.Router();
router.post("/patient/register",patientRegister);
router.post("/login",login); //login for both patients and admins
router.get("/doctors",getAllDoctors); //to get the array of doctors
router.post("/admin/addnew",isAdminAuthenticated,addNewAdmin);//here authenticated wala is also passed to make sure nobody else can add a new admin except for them
router.get("/admin/me",isAdminAuthenticated,getUserDetails); //admin login karega toh apni details get kar sake
router.get("/patient/me",isPatientAuthenticated,getUserDetails); //patient login karega toh apni details le sake
router.get("/admin/logout",isAdminAuthenticated,logoutAdmin); //admin logout
router.get("/patient/logout",isPatientAuthenticated,logoutPatient); //patient logout
router.post("/doctor/addnew",isAdminAuthenticated,addNewDoctor); //only an admin can add a new doctor

export default router;
