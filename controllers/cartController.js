import cartModel from "../model/cartModel.js";
import productModel from "../model/productModel.js";
import JWT from "jsonwebtoken";

const compareString = (str1, str2) => {
  str1 = String(str1);
  str2 = String(str2);
  if (str1.length !== str2.length) return false;
  else {
    for (let i = 0; i < str1.length; i++) {
      if (str1.at(i) !== str2.at(i)) {
        return false;
      }
    }
    return true;
  }
};

export const addToCartController = async (req, res) => {
  try {
    const productId = req.query._id;
    const token = req.headers.authorization;
    const decodedToken = await JWT.verify(token, process.env.JWT_SECRET);
    const buyerId = decodedToken._id;
    const data = {
      productId,
      buyerId,
    };

    const cartItems = Array.from(await cartModel.find({ productId }));
    const len = cartItems.length;
    if (len >= Number(1)) {
      for (let i = 0; i < cartItems.length; i++) {
        if (compareString(cartItems[i].buyerId, buyerId)) {
          return res.status(201).send({
            success: true,
            message: "Added to Cart successfully",
          });
        }
      }
      console.log(cartItems.buyerId, buyerId);
      const addtoCartProduct = await new cartModel(data).save();
      return res.status(201).send({
        success: true,
        message: "Added to Cart successfully",
        addtoCartProduct,
      });
    } else {
      console.log("I am adddeddd");
      const addtoCartProduct = await new cartModel(data).save();
      return res.status(201).send({
        success: true,
        message: "Added to Cart successfully",
        addtoCartProduct,
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error in adding product",
      error,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = await JWT.verify(token, process.env.JWT_SECRET);
    const buyerId = decodedToken._id;
    const productId = req.query._id;
    if (!productId) {
      return res.send({ message: "Please provide the productId" });
    } else {
      const cartProducts = await cartModel.find({ productId });
      for (let i = 0; i < cartProducts.length; i++) {
        if (compareString(buyerId, cartProducts[i].buyerId)) {
          const _id = cartProducts[i]._id;
          const deletedCartItem = await cartModel.deleteOne({ _id });
          if (deletedCartItem) {
            return res.status(200).send({
              success: true,
              deletedCartItem,
            });
          }
        } else {
          return res.status(404).send({
            success: false,
            error: "Failed to delete",
          });
        }
      }
      return res.status(404).send({
        success: false,
        error: "Failed to delete",
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

export const getAllCartProducts = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = await JWT.verify(token, process.env.JWT_SECRET);
    const buyerId = decodedToken._id;

    const cartProducts = await cartModel.find({ buyerId });
    const products = [];
    let totalPrice = 0;
    for (let i = 0; i < cartProducts.length; i++) {
      const _id = cartProducts[i].productId;
      let product = await productModel.findById(_id);
      totalPrice += product.productPrice;
      const updatedProduct = Object.assign({}, product._doc,{quantity:1});
      products.push(updatedProduct);
    }
    res.status(200).send({
      success: true,
      products,
      totalPrice,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Error in adding product",
      error,
    });
  }
};
