import mongoose from "mongoose";

const userSchema = new mongoose.Schema ({
    username: {type : String },
    name : {type : String},
    password : {type : String},
    email: {type : String},
    isAdmin : {type : Boolean, default: false },
})

export const User = mongoose.model('User', userSchema);