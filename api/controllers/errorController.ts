// q@ts-nocheck
/* eslint-disable */
import { Response, NextFunction } from "express";
import AppError from "../utils/appError";
import { CustomRequest, CustomError } from "./customTypes";

const handleCastErrorDB = (err: CustomError) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError({message: message, statusCode: 400});
};

const handleDuplicateFieldsDB = (err: CustomError) => {
    const value = Object.values(err.keyValue)[0];
    const message = `Duplicate field value: ${value}. Use another value.`;
    return new AppError({message: message, statusCode: 400});
};

const handleValidationErrorDB = (err: CustomError) => {
    const errors = Object.values(err.errors).map((el) => el.message);

    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError({message: message, statusCode: 400});
};

const handleJWTError = () => new AppError({message: "Invalid token. Please log in again!", statusCode: 401});

const handleJWTExpiredError = () => new AppError({message: "Your token has expired! Please log in again.", statusCode: 401});

const sendErrorDev = (err: CustomError, req: CustomRequest, res: Response) => {
    if (req.originalUrl.startsWith("/api")) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
};

const sendErrorProd = (err: CustomError, req: CustomRequest, res: Response) => {
    if (req.originalUrl.startsWith("/api")) {
        // A) Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        // B) Programming or other unknown error: don't leak error details
        // 1) Log error
        console.error("ERROR 💥", err);
        // 2) Send generic message
        return res.status(500).json({
            status: "error",
            message: "Something went very wrong!"
        });
    }

    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error("ERROR 💥", err);
    // 2) Send generic message
    return res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: "Please try again later."
    });
};

module.exports =  (err: CustomError, req: CustomRequest, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
        let error = Object.create(err);
        error.message = err.message;

        if (error.name === "CastError") error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === "ValidationError") error = handleValidationErrorDB(error);
        if (error.name === "JsonWebTokenError") error = handleJWTError();
        if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

        sendErrorDev(error, req, res);
    } else if (process.env.NODE_ENV === "production") {
        let error = Object.create(err);
        error.message = err.message;

        if (error.name === "CastError") error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === "ValidationError") error = handleValidationErrorDB(error);
        if (error.name === "JsonWebTokenError") error = handleJWTError();
        if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

        sendErrorProd(error, req, res);
    }
};
