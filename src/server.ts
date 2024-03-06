import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database/database";
import { BASEURL } from "./constants";
import { authRouter } from "./routes/authRoutes";
import { httpResponse } from "./helpers/createResponse";
import { routeNotFound } from "./middleware/routeNotFound";
import { errorHandler } from "./middleware/errorHandler";
import { userRouter } from "./routes/userRoutes";
import {productRouter} from "./routes/productRoutes"
import { serviceRouter } from "./routes/serviceRoutes";
import { grant_accessRouter } from "./routes/grant_access_Routes";
import { cartRouter } from "./routes/cartRoutes";
import { billRouter } from "./routes/billRoutes";
import { orderRouter } from "./routes/orderRouter";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(`${BASEURL}/auth`, authRouter);
app.use(`${BASEURL}/users`, userRouter, productRouter, serviceRouter, cartRouter, billRouter, orderRouter);
app.use(`${BASEURL}/admin`, productRouter, serviceRouter, orderRouter, grant_accessRouter);

app.use("/ok", (_req, _res) => {
    _res.status(200).send(httpResponse(true, "OK", {}))
})

app.use(routeNotFound);
app.use(errorHandler);

const port = process.env.PORT || 9000;
try{
    if(!process.env.CONNECTION)
        throw new Error("no connection string found in .env file");
    connectDB(process.env.CONNECTION);

    app.listen(port, () => {
        console.log(`server listening on : http://localhost:${port}/`);
    });
} catch (error) {
    console.error(error);
}