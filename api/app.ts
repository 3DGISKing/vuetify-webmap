// q@ts-nocheck
/* qeslint-disable */
import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import userRouter from "./routes/userRouter";

const app = express();
const xss = require("xss-clean");
const globalErrorHandler = require("./controllers/errorController");

require("colors");
require("express-async-errors");

// Import .env variables
dotenv.config({ path: path.resolve(__dirname, "./config.env") });

app.set("trust proxy", true);

// Enable body parser
app.use(express.json({ limit: "50mb" }));

// Enable cookie parser
app.use(cookieParser());

// Server build folder
app.use(express.static(path.join(__dirname, "build")));

// Set security HTTP headers
app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Enable cors

const whitelist = ["http://localhost:3000"];
const corsOptions = {
    origin: function (origin: any, callback: any) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
};

app.use(cors(corsOptions));

// API Routes
app.use("/api/v1/users", userRouter);

/////////////////////////////////////////////////////////////////////////////////////////
// TODO: Refactor
const databaseName = "siros-web-dev";

const dataSchema = new mongoose.Schema({}, { strict: false });
const dataModel = mongoose.model(databaseName, dataSchema, "dataSchemas");
const credentialsModel = mongoose.model(databaseName, dataSchema, "credentials");
const acquisitionModel = mongoose.model(databaseName, dataSchema, "acquisitions");

// Enable global error handler
app.use(globalErrorHandler);

export default app;
