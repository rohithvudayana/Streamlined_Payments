import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database/database";
import { BASEURL } from "./constants";
import { authRouter } from "./routes/authRoutes";
dotenv.config();

// Express app 
const app = express();  

// Middelware 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes 
app.use(`${BASEURL}/auth`, authRouter);


const port = process.env.PORT || 3000;
try{ 
    if(!process.env.CONNECTIONSTR)
        throw new Error("no connection string found in .env file");
    connectDB(process.env.CONNECTIONSTR); 

    app.listen(port, () => {
        console.log(`server listening on : http://localhost:${port}/`);
    });
} catch (error) {
    console.error(error);
}