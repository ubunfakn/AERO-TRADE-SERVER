import JWT from "jsonwebtoken";
import userModal from "../model/userModal.js";

//ProtectedRoute token based

export const sellerMiddleware = async (req, res, next) => {
  try {
    const decode = await JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const _id = decode._id;
    const user = await userModal.findOne({_id});
    if(user.role === "SELLER"){
        next();
    }else{
      res.status(403).json({ message: 'You are not authorized as a seller.' });
    }
  } catch (error) {
    res.send("JWT token is not valid");
    console.log(error);
  }
};
