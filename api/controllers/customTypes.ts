// q@ts-nocheck
/* eslint-disable */
import { Request } from "express";
import { IUserDocument } from "../models/user";

export interface CustomRequest extends Request {
    user: IUserDocument
};

export interface CustomError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    errors: Error[];
    keyValue: string;
    path: string;
    value: string;
}