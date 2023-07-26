import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    productName:{
        type:String,
        required:true,
    },
    productLocation:{
        type:String,
        required:true,
    },
    productQuantity:{
        type:Number,
        required:true
    },
    productPrice:{
        type:Number,
        required:true
    },
    shippingDate:{
        type:String,
        required:true
    },
    sellerName:{
        type: String,
        required:true
    },
    sellerId:{
        type:String,
        required:true
    }
},{timestamps:true});

export default mongoose.model('products', productSchema);