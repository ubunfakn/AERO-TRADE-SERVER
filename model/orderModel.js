import mongoose, { model } from "mongoose";

const orderSchema = mongoose.Schema(
  {
    products: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      sellerName: {
        type: String,
        required: true,
      },
      shippingDate: {
        type: String,
        required: true,
      },
    },
    orderStatus: {
      type: String,
      default: "WAITING",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: true,
    },
    buyerId: {
      type: String,
      required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("orders", orderSchema);
