import express from 'express';
import { getUserController, editUserController } from '../controllers/userController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post("/getuser",requireSignIn,getUserController);
router.put("/editprofile",requireSignIn,editUserController);

export default router;