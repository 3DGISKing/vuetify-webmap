// q@ts-nocheck
/* eslint-disable */
import { Response, NextFunction } from "express";
import catchAsync from "./../utils/catchAsync";
import AppError from "../utils/appError";
import APIFeatures from "../utils/apiFeatures";
import { CustomRequest } from "./customTypes";
/**
 * Handler factory for creating CRUD operations easily
 */

export const deleteOne = (Model: any) =>
    catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
        const doc = await Model.findById(req.params.id);

        if (!doc) {
            return next(new AppError({message: "No document found with that ID", statusCode: 404}));
        }

        await Model.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: "success",
            data: null
        });
    });

export const updateOne = (Model: any) =>
    catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
        const doc = await Model.findById(req.params.id);

        if (!doc) {
            return next(new AppError({message: "No document found with that ID", statusCode: 404}));
        }

        const newDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: "success",
            data: {
                data: newDoc
            }
        });
    });

export const createOne = (Model: any, id?: boolean) =>
    catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
        if (id) {
            req.body.user = req.user.id;
        }
        Model.create(req.body, function (err: any, doc: any) {
            if (err) {
                console.error(err);

                res.status(201).json({
                    status: "error",
                    data: {
                        data: "error"
                    }
                });

                return;
            }

            // success

            res.status(201).json({
                status: "success",
                data: {
                    data: doc
                }
            });
        });
    });

export const getOne = (Model: any) =>
    catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
        let query = Model.findById(req.params.id);
        const doc = await query;

        if (!doc) {
            return next(new AppError({message: "No document found with that ID", statusCode: 404}));
        }

        res.status(200).json({
            status: "success",
            data: {
                data: doc
            }
        });
    });

export const getAll = (Model: any) =>
    catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
        let filter = {};
        if (req.params.aquisitionid) filter = { acquisition: req.params.aquisitionid };

        // To allow for nested GET reviews on tour (hack)
        //@ts-ignore
        const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate();
        // const doc = await features.query.explain();
        const doc = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status: "success",
            results: doc.length,
            data: {
                data: doc
            }
        });
    });
