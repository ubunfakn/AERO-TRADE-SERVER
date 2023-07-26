import productModel from "../model/productModel.js";
import userModal from "../model/userModal.js";

export const productController = async (req, res) => {
  try {
    console.log("I am in");
    const products = await productModel.find();
    console.log(products);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error in fetching products",
      error,
    });
  }
};

export const getSellersController = async (req, res) => {
  try {
    const sellers = await userModal.find({ role: "SELLER" });
    if (!sellers) {
      return res
        .status(404)
        .json({ success: false, message: "No Sellers Found!" });
    } else {
      for(let i=0;i<sellers.length;i++){
        sellers[i].password=undefined;
      }
      res.status(200).send({ success: true, sellers });
    }
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error in fetching sellers",
      error,
    });
  }
};

export const getproductsbyseller = async (req, res) => {
  try {
    let _id = req.query._id;
    console.log(_id, "_id");
    const products = await productModel.find({ sellerId: _id });
    if (products.length == 0) {
      return res
        .status(404)
        .send({
          success: false,
          message: "No products found for the selected seller",
        });
    } else {
      res.status(200).send({ success: true, products });
    }
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error in fetching sellers",
      error,
    });
  }
};
