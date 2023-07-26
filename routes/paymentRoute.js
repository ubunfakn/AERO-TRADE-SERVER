import express from "express";
import { createOrderController, updateOrderController } from "../controllers/buyerController.js";
import {requireSignIn} from "../middlewares/authMiddleware.js";
import {buyerMiddleware} from "../middlewares/buyerMiddleware.js";

const router = express.Router();

router.post(
  "/createorder",
  [requireSignIn, buyerMiddleware],
  createOrderController
);

router.post('/updateorder', [requireSignIn,buyerMiddleware] , updateOrderController);

export default router;
