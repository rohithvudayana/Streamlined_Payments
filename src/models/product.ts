import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type: String},
    price: {type: Number}
})

export const product = mongoose.model('product', productSchema);