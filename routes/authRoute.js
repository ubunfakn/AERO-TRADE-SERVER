import express from "express";
import {registerController, loginController, forgotPasswordController, changePasswordController} from '../controllers/authController.js';

//router object
const router = express.Router();

//routing
//Register Route Post method
router.post('/register',registerController);

//Login Route Post method
router.post('/login',loginController);

//Forgot Password Post method
router.post('/forgot',forgotPasswordController);

//Change Password Post method
router.post("/change", changePasswordController);

export default router;