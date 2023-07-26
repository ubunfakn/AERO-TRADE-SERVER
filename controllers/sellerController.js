import JWT from "jsonwebtoken";
import productModel from "../model/productModel.js";
import userModal from "../model/userModal.js";
import cartModel from '../model/cartModel.js';

export const addProductController = async (req, res) => {
  try {
    const {
      _id,
      productName,
      productLocation,
      productQuantity,
      productPrice,
      shippingDate,
      sellerName,
    } = req.body;
    if (
      productLocation === "" ||
      productName === "" ||
      productPrice === undefined ||
      productQuantity === undefined ||
      shippingDate === "" ||
      sellerName === ""
    ) {
      return res.send({
        success: false,
        error: "Fields cannot be empty",
      });
    }

    const token = req.headers.authorization;
    const decodedToken = await JWT.verify(token, process.env.JWT_SECRET);
    const sellerId = decodedToken._id;
    if (_id === "") {
      const product = new productModel({
        productName,
        productLocation,
        productQuantity,
        productPrice,
        shippingDate,
        sellerName,
        sellerId,
      }).save();

      res.status(201).send({
        success: true,
        message: "Product saved successfully",
        product,
      });
    } else {
      const data = {
        productName,
        productLocation,
        productQuantity,
        productPrice,
        shippingDate,
      };
      let updatedproduct = await productModel.updateOne(
        { _id },
        { $set: data }
      );
      res.status(201).send({
        success: true,
        message: "Product updated successfully",
        updatedproduct,
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error in saving product",
      error,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModal.findOne({ email });
    const product = await productModel.find({ sellerId: user._id });
    res.status(200).send({
      success: true,
      product,
    });
    console.log("found");
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error in saving product",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    console.log(req.query._id)
    const _id = req.query._id;
    if (!_id) {
      return res.send({ message: "Please provide the productId" });
    } else {
      let deletedProduct = await productModel.deleteOne({_id});
      let removedFromcartProduct = await cartModel.delete({productId:_id});
      if(deletedProduct){
        res.status(200).send({
          success: true,
          deletedProduct,
        });
      }else{
        res.status(404).send({
          success: false,
          error:"Failed to delete"
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error in saving product",
      error,
    });
  }
};
