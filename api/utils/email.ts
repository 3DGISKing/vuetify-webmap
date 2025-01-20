// q@ts-nocheck
/* eslint-disable */

import nodemailer from "nodemailer";
import { IUserDocument } from "../models/user";
/**
 * Class for sending emails in express
 */

interface EmailConstructorOptions {
    user: IUserDocument;
    url: string;
    message: string
}

class Email {
    to: string;
    firstName: string;
    url: string;
    from: string;
    message: string;

    constructor({ user, url, message }: EmailConstructorOptions) {
        this.to = user.email;
        this.firstName = `${user.firstName} ${user.lastName}`;
        this.url = url;
        this.from = `Siros Technologies email@sirostechnologies.com`;
        this.message = message;
    }

    newTransport() {
        if (process.env.NODE_ENV === "production") {
            // Sendgrid
            return nodemailer.createTransport({
                service: "SendGrid",
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
        }

        return nodemailer.createTransport({
            //@ts-ignore
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    // Send the actual email
    async send() {
        // TODO: Make Email templates
        // 1) Render HTML template

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: this.message,
            // html,,
            text: this.url
        };

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        //@ts-ignore
        await this.send("welcome", "Welcome to the Siros Technologies!");
    }

    async sendPasswordReset() {
        //@ts-ignore
        await this.send("passwordReset", "Your password reset token (valid for only 10 minutes)");
    }
};

export default Email;