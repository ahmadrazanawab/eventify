import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        console.log("MongoDB already connected");
        return;
    }

    if (!process.env.CONNECTIONSTRING) {
        throw new Error("MongoDB connection string not found in .env");
    }

    try {
        const db = await mongoose.connect(process.env.CONNECTIONSTRING);
        isConnected = true;
        console.log(`MongoDB connected: ${db.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};
