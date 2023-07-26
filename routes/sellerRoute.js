import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { sellerMiddleware } from "../middlewares/sellerMiddleware.js";
import {
  addProductController,
  deleteProductController,
  getProductController,
} from "../controllers/sellerController.js";
import { acceptOrder } from "../controllers/searchController.js";

const router = express.Router();

router.post(
  "/addproduct",
  [requireSignIn, sellerMiddleware],
  addProductController
);

router.post(
  "/getproduct",
  [requireSignIn, sellerMiddleware],
  getProductController
);

router.delete(
  `/deleteproduct`,
  [requireSignIn, sellerMiddleware],
  deleteProductController
);

router.get('/acceptorder',[requireSignIn,sellerMiddleware],acceptOrder);

export default router;
