import mongoose from "mongoose";

const StudentRegistrationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "SignUp", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    eventFees: { type: Number, default: 0 }, // optional
    paymentStatus: { type: String, enum: ["none", "pending", "paid"], default: "none" },
    paymentMethod: { type: String, enum: ["none", "online", "cash"], default: "none" },
    registeredAt: { type: Date, default: Date.now },
});

// Prevent duplicate registrations for the same student and event
StudentRegistrationSchema.index({ student: 1, event: 1 }, { unique: true });

const StudentRegistrationModel =
    mongoose.models.StudentRegistration || mongoose.model("StudentRegistration", StudentRegistrationSchema);
export { StudentRegistrationModel };

// import mongoose from "mongoose";

// const StudentEventSchema = new mongoose.Schema({
//   student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
//   registeredAt: { type: Date, default: Date.now },
// });

// export const StudentEventModel = mongoose.models.StudentEvent || mongoose.model("StudentEvent", StudentEventSchema);
