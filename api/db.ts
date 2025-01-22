// q@ts-nocheck
/* qeslint-disable */
const { networkInterfaces } = require("os");
import mongoose from "mongoose";
import chalk from "chalk";

/**
 * Connect to MongoDB
 */

const connectDB = async () => {
    try {
        let uri = "mongodb://127.0.0.1:27017/marine";

        // https://stackoverflow.com/questions/74747476/deprecationwarning-mongoose-the-strictquery-option-will-be-switched-back-to
        mongoose.set("strictQuery", true);

        const conn = await mongoose.connect(uri);

        console.log(chalk.blackBright.bgCyan.bold(`MongoDB Connected: ${conn.connection.host}`));
    } catch (error) {
        console.error(`Error connecting databse`, error);
        process.exit(1);
    }
};

export default connectDB;
