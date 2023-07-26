import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import sellerRoute from "./routes/sellerRoute.js";
import cors from "cors";
import bodyParser from "body-parser";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import searchRoute from "./routes/searchRoute.js";
import buyerRoute from "./routes/buyerRoute.js";
import paymentRoute from './routes/paymentRoute.js';
import messageRoute from './routes/messageRoute.js';

//Configure env
dotenv.config();

//rest object
const app = express();

//connect db
connectDB();

//Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());

//routes
app.use(cors());

//Authentication route
app.use("/api/v1/auth", authRoutes);

//User route
app.use("/api/v1/user", userRoute);

//Seller route
app.use("/api/v1/seller", sellerRoute);

//Buyer route
app.use("/api/v1/buyer", buyerRoute);

//Product route
app.use("/api/v1", productRoute);

//Search route
app.use("/api/v1/search", searchRoute);

//Payment route
app.use("/api/v1/payment", paymentRoute)

//Messaging route
app.use('/api/v1/message',messageRoute);

//Server Starting
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
