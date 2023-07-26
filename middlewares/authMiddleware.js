import JWT from "jsonwebtoken";

//ProtectedRoute token based

export const requireSignIn = (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers["authorization"],
      process.env.JWT_SECRET,(err,decoded)=>{
        if(!err)next();
        else console.log(err);
      }
    );
  } catch (error) {
    res.send("JWT token is not valid");
    console.log(error);
  }
};
