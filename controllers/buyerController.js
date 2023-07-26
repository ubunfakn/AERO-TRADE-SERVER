import Razorpay from "razorpay";
import productModel from "../model/productModel.js";
import JWT from "jsonwebtoken";
import orderModel from "../model/orderModel.js";

export const createOrderController = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const randomNumber = Math.floor(Math.random() * 10000);
    const receipt = `order_receipt${randomNumber}`;
    const amount = Number(req.body.totalPrice * 100);

    const option = {
      amount,
      currency: "INR",
      receipt,
    };

    razorpay.orders.create(option, (err, order) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to create order" });
      }
      res.status(201).json(order);
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Error in creating order",
      error,
    });
  }
};

export const updateOrderController = async (req, res) => {
  try {
    const products = req.body.products;
    const orders = [];
    for (let i = 0; i < products.length; i++) {
      const _id = products[i]._id;
      const quantity = products[i].quantity;
      const productQuantity = products[i].productQuantity - quantity;
      const updatedProduct = await productModel.updateOne(
        { _id },
        { $set: { productQuantity } }
      );
      const totalPrice = req.body.totalPrice;
      const razorpay_order_id = req.body.response.razorpay_order_id;
      const razorpay_payment_id = req.body.response.razorpay_payment_id;
      const paymentStatus = "SUCCESS";
      const token = req.headers.authorization;
      const decodedToken = await JWT.verify(token, process.env.JWT_SECRET);
      const buyerId = decodedToken._id;
      const data = {
        totalPrice,
        razorpay_order_id,
        razorpay_payment_id,
        paymentStatus,
        buyerId,
        sellerId: products[i].sellerId,
        products: {
          id: products[i]._id,
          name: products[i].productName,
          price: products[i].productPrice,
          quantity,
          sellerName: products[i].sellerName,
          shippingDate: products[i].shippingDate,
        },
      };
      const order = await new orderModel(data).save();
      orders.push(order);
    }
    res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in saving order",
      error,
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = await JWT.verify(token, process.env.JWT_SECRET);
    const _id = decodedToken._id;

    const orders = await orderModel.find({
      $or: [{ sellerId: _id }, { buyerId: _id }],
    });
    if (orders.length > 0) {
      res.status(200).send({ success: true, orders });
    } else {
      res.status(404).send({ message: "No orders found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching orders",
      error,
    });
  }
};

export const cancelOrderController = async (req, res) => {
  try {
    const _id = req.query._id;
    console.log(_id);
    let order = await orderModel.updateOne(
      { _id },
      { $set: { orderStatus: "CANCELLED" } }
    );
    order = await orderModel.findById(_id);
    const productId = order.products.id;
    const product = await productModel.findById(productId);
    console.log(product);
    const result = await productModel.updateOne(
      { _id: productId },
      {
        $set: {
          productQuantity: product.productQuantity + order.products.quantity,
        },
      }
    );
    res.status(200).send({ message: "Order cancelled" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occurred during order cancellation",
      error,
    });
  }
};
