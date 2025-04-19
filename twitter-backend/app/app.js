import dotenv from "dotenv";
import express from "express";
import cors from "cors";


import authRoutes from "./routes/auth.routes.js";
import tweetRoutes from "./routes/tweet.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/tweet", tweetRoutes);

app.use(notFound);
app.use(errorHandler);



export default app;