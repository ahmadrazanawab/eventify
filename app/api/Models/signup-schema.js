import mongoose from "mongoose";

const SignUpSchema = new mongoose.Schema(
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
    mongoose.models.SignUp || mongoose.model("SignUp", SignUpSchema);

export default SignUpModel;
