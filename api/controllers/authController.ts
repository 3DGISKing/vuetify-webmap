// q@ts-nocheck
/* qeslint-disable */
import { Response, NextFunction } from "express";
import crypto from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import UserModel, { IUserDocument } from "../models/user";
import AppError from "../utils/appError";
import Email from "../utils/email";
import catchAsync from "./../utils/catchAsync";
import { CustomRequest } from "./customTypes";

const allowMultiDevicesLogin = true;

// Sign JWT token
const signToken = (id: string) => {
    return jwt.sign({ id: id, iat: Date.now() + 5000 }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

let expiresHours = 2;

// Send JWT Token
const createSendToken = (user: IUserDocument, statusCode: number, res: Response) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + expiresHours * 60 * 60 * 1000),
        secure: false
        // httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);

    // Remove password from output
    user.password = "";

    res.status(statusCode).json({
        status: "success",
        token: token,
        data: {
            user
        }
    });
};

// Signup User Route
export const signup = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const signedUpUser = await UserModel.findOne({ email: req.body.email });

    if (signedUpUser) {
        return next(new AppError({ message: "User with that email already exists", statusCode: 400 }));
    }

    try {
        const demoPeriod = 30;

        const newUser = await UserModel.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            beta: true,
            active: false,
            trial: true,
            expiresOn: Date.now() + demoPeriod * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            status: "success",
            data: {
                user: newUser
            }
        });
    } catch (error: any) {
        return next(new AppError({ message: error._message, statusCode: 400 }));
    }
});

// Signup for an organization
export const signupOrganization = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.body.organization) {
        return next(new AppError({ message: "You must provide your oganizations name", statusCode: 400 }));
    }

    const newOrganization = await UserModel.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        organization: req.body.organization,
        role: "organization",
        userLimit: 5,
        userCount: 0
    });

    // const url = `${req.protocol}://${req.get('host')}/me`
    // console.log(url)
    // await new Email(newUser, url).sendWelcome()

    createSendToken(newOrganization, 201, res);
});

// Signup user under an organization
export const signupUnderOrganization = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    // Check it user is a organization
    if (req.user.role === "user") {
        return next(new AppError({ message: "You are not organization and can not sign up users", statusCode: 401 }));
    }

    await UserModel.findByIdAndUpdate(
        req.user._id,
        { userCount: updatedUserCount },
        {
            new: true,
            runValidators: true
        }
    );

    // Create new user for the organization
    const newUser = await UserModel.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    });

    // const url = `${req.protocol}://${req.get('host')}/me`
    // console.log(url)
    // await new Email(newUser, url).sendWelcome()

    res.status(201).json({
        status: "success",
        data: {
            user: newUser
        }
    });
});

// Login User Route
export const login = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError({ message: "Please provide email and password!", statusCode: 400 }));
    }
    // 2) Check if user exists && password is correct
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError({ message: "Incorrect email or password", statusCode: 401 }));
    }

    // Update users last login time
    const updatedUser = await UserModel.findByIdAndUpdate(
        user._id,
        { lastLogin: Date.now() },
        {
            new: true,
            runValidators: true
        }
    );

    createSendToken(updatedUser!, 200, res);
});

// Logout User
export const logout = catchAsync(async (req: CustomRequest, res: Response) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: "success" });
});

// Middleware to protect routes if user is not logged in
export const protect = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1) Getting token and check of it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError({ message: "You are not logged in! Please log in to get access.", statusCode: 401 }));
    }

    // 2) Verification token
    //@ts-ignore
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    //@ts-ignore
    const currentUser = await UserModel.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError({ message: "The user belonging to this token does no longer exist.", statusCode: 401 })
        );
    }

    // 4) Check if user changed password after the token was issued
    //@ts-ignore
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError({ message: "User recently changed password! Please log in again.", statusCode: 401 }));
    }

    // console.log(new Date(currentUser.lastLogin).getTime());
    // console.log(decoded.iat);

    // Check if user logged in on another device
    if (!allowMultiDevicesLogin) {
        //@ts-ignore
        if (new Date(currentUser.lastLogin).getTime() > parseInt(decoded.iat)) {
            return next(
                new AppError({
                    message: "You are logged in on another device. Sign in again to continue",
                    statusCode: 401
                })
            );
        }
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

// Get the current User
export const currentUser = catchAsync(async (req: CustomRequest, res: Response) => {
    res.status(200).json({
        status: "success",
        data: {
            currentUser: req.user
        }
    });
});

// Get the all User
export const allUsers = catchAsync(async (req: CustomRequest, res: Response) => {
    let filter = {};

    const users = await UserModel.find(filter);
    res.status(200).json({
        status: "success",
        data: {
            users: users
        }
    });
});

// Send forgot password email
export const forgotPassword = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1) Get user based on POSTed email
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError({ message: "There is no user with email address.", statusCode: 404 }));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    try {
        const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;

        await new Email({
            user: user,
            url: resetURL,
            message: "Your password reset token (valid for only 10 minutes)"
        }).send();

        res.status(200).json({
            status: "success",
            message: "Token sent to email!"
        });
    } catch (err) {
        await user.save({ validateBeforeSave: false });

        console.log(err);

        return next(
            new AppError({ message: "There was an error sending the email. Try again later!", statusCode: 500 })
        );
    }
});

export const resetPassword = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1) Get user based on the token
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await UserModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError({ message: "Token is invalid or has expired", statusCode: 400 }));
    }
    user.password = req.body.password;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1) Get user from collection
    const user = await UserModel.findById(req.user.id).select("+password");

    // 2) Check if POSTed current password is correct
    if (!(await user?.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError({ message: "Your current password is wrong.", statusCode: 401 }));
    }

    // 3) If so, update password
    user!.password = req.body.password;
    await user?.save();
    // User.findByIdAndUpdate will NOT work as intended!

    // 4) Log user in, send JWT
    createSendToken(user!, 200, res);
});
