import express from "express";

import {
  productController,
  getSellersController,
  getproductsbyseller,
} from "../controllers/productController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/products", requireSignIn, productController);

router.get("/getsellers", requireSignIn, getSellersController);

router.get("/getproductsbyseller", requireSignIn, getproductsbyseller);

export default router;
