import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { buyerMiddleware } from "../middlewares/buyerMiddleware.js";
import {
  addToCartController,
  getAllCartProducts,
  removeFromCart,
} from "../controllers/cartController.js";

import { getAllOrdersController,cancelOrderController } from "../controllers/buyerController.js";

const router = express.Router();

router.post(
  "/addtocart",
  [requireSignIn, buyerMiddleware],
  addToCartController
);

router.get("/cart", [requireSignIn, buyerMiddleware], getAllCartProducts);

router.delete(
  "/removefromcart",
  [requireSignIn, buyerMiddleware],
  removeFromCart
);

router.get('/getOrders', requireSignIn, getAllOrdersController);

router.delete('/cancelorder',requireSignIn,cancelOrderController);

export default router;
