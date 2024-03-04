import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type: String , require: true},
    price: {type: Number, require: true}
})

export const Product = mongoose.model('product', productSchema);