import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name:{type: String} ,
    price:{type: Number}
})

export const Service = mongoose.model('service', serviceSchema);