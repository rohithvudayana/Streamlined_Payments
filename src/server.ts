import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database/database";
dotenv.config();

const app = express(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT || 3000;
try{ 
    console.log(process.env.PORT);
    
    if(!process.env.CONNECTIONSTR)
        throw new Error("no connection string found in .env file");
    connectDB(process.env.CONNECTIONSTR); 

    app.listen(port, () => {
        console.log(`server listening on : http://localhost:${port}/`);
    });
} catch (error) {
    console.error(error);
}