// q@ts-nocheck
/* eslint-disable */
import { Response, NextFunction } from "express";
import catchAsync from "./../utils/catchAsync";
import UserModel from "../models/user";
import { getOne, getAll, updateOne, deleteOne } from "./handlerFactory";
import { CustomRequest } from "./customTypes";

export const updateMe = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const filterObj = (obj : any, ...allowedFields: any[]) => {
        const newObj: any = {};
        Object.keys(obj).forEach((el) => {
            if (allowedFields.includes(el)) newObj[el] = obj[el];
        });
        return newObj;
    };

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "firstName", "email", "lastName");

    // 3) Update user document
    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }
    });
});

export const deleteMe = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    await UserModel.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: "success",
        data: null
    });
});

export const deleteUsersByIds = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const UserIds = req.body.ids;

    await UserModel.deleteMany({
        _id: { $in: UserIds }
    });

    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        data: null
    });
});

export const getUser = getOne(UserModel);
export const getAllUsers = getAll(UserModel);

// Do NOT update passwords with this!
export const updateUser = updateOne(UserModel);
export const deleteUser = deleteOne(UserModel);
