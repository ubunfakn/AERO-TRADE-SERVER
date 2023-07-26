import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    sender:{
        type:String,
        required:true,
    },
    receiver:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
})

export default mongoose.model('messages',messageSchema);