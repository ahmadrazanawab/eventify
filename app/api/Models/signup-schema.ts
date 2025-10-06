import mongoose from "mongoose";
import { ISignUp } from "@/app/type/IsignUp";

// interface ISignUp {
//   name: string;
//   email: string;
//   phone: number;
//   designation?: string;
//   department?: string;
//   year?: string;
//   secretCode?: string;
//   password: string;
//   role: "admin" | "student";
// }

const SignUpSchema = new mongoose.Schema<ISignUp>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: Number, required: true, unique: true },
        designation: { type: String },
        department: { type: String },
        year: { type: String },
        secretCode: { type: String },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["admin", "student"],
            required: true,
        },
    },
    { timestamps: true }
);

const SignUpModel =
    mongoose.models.SignUp || mongoose.model<ISignUp>("SignUp", SignUpSchema);

export default SignUpModel;
