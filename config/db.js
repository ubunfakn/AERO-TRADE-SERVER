import mongoose from "mongoose";
import colors from 'colors';

const connectDB = async ()=>{
    try {
        const con = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to MongoDB database ${con.connection.host}`)
    } catch (error) {
        console.log(`Error in mongodb ${error}` .bgRed.white);
    }
}

export default connectDB;