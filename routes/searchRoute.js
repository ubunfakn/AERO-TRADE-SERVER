import express from 'express';
import { requireSignIn } from '../middlewares/authMiddleware.js';
import { searchController } from '../controllers/searchController.js';

const router = express.Router();

router.get('/',requireSignIn,searchController);

export default router;