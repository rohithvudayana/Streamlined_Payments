import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export interface SerializedUser {
    userId : string,
    userName: string,
    isAdmin: boolean
} 
type UserDocument = any;

export const SerializeUser = (user : UserDocument ) : SerializedUser => {
    return ( { userId : user.user._id, userName: user.email, isAdmin: user.isAdmin});
}

export const genToken = (user: UserDocument | SerializedUser) => {
    const userToken = !user.hasOwnProperty("userId") ? SerializeUser(user as UserDocument) : {
        userId: (user as SerializedUser).userId,
        userEmail: (user as SerializedUser).userName,
        isAdmin: (user as SerializedUser).isAdmin,
    };
    if(!process.env.JWT_ACCESS_SECRET){
        console.log("JWT_ACCESS_SECRET not found");
        throw new Error("JWT ACCESS SECRET not found");
    }
    return jwt.sign(userToken, process.env.JWT_ACCESS_SECRET, {expiresIn: "15m"});
};