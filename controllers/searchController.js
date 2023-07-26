import productModel from "../model/productModel.js";
import orderModel from '../model/orderModel.js';

export const searchController = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    if (keyword) {
      const products = await productModel.find({
        $or: [{ productName: { $regex: keyword } }],
      });
      if (!products) {
        return res.status(404).send({ success: false, message: "Not found" });
      } else {
        res.status(200).send({ success: true, products });
      }
    } else {
      return res.status(404).send({ success: false, message: "Not found" });
    }
    console.log(keyword);
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error in fetching product",
      error,
    });
  }
};

export const acceptOrder = async (req, res)=>{
  try {
    const _id = req.query._id;
    console.log(_id);
    let order = await orderModel.updateOne(
      { _id },
      { $set: { orderStatus: "ACCEPTED" } }
    );
    res.status(200).send({ message: "Order Accepted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occurred during order approval",
      error,
    });
  }
}
