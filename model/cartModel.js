import mongoose from "mongoose";

const cartModel = new mongoose.Schema(
  {
    buyerId: {
      type: String,
      reuired: true,
    },
    productId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("cart", cartModel);
