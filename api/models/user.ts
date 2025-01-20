// q@ts-nocheck
/* qeslint-disable */
import { Types, Schema, Model, model, Document } from "mongoose";
import crypto from "crypto";
import validator from "validator";
import bcrypt from "bcryptjs";

interface IUser {
    firstName: string;
    lastName: string;
    role: string;
    password: string;
    lastLogin?: Date;
    createdAt: Date;
}

export interface IUserDocument extends IUser, Document {
    createPasswordResetToken: () => Promise<void>;
    correctPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
}

export type IUserModel = Model<IUserDocument>;

const userSchema: Schema = new Schema({
    firstName: {
        type: String,
        required: [true, "Please provide a first name!"]
    },
    lastName: {
        type: String,
        required: [true, "Please provide a last name!"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    role: {
        type: String,
        enum: ["user", "organization", "admin"],
        default: "user"
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        select: false
    },
    lastLogin: Date,
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash user password on save
userSchema.pre("save", async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified("password")) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

// Set passwordChangedAt if user changes password
userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
});

// Method to test if password provided is correct
userSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to ensure user as a new JWT after changing password
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
    if (this.passwordChangedAt) {
        const changedTimestamp = this.passwordChangedAt.getTime() / 1000;

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

// Create password reset token
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const UserModel = model<IUserDocument>("User", userSchema) as IUserModel;

export default UserModel;
