import mongoose from "mongoose";

const StudentRegistrationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    eventFees: { type: Number, default: 0 }, // optional
    registeredAt: { type: Date, default: Date.now },
});

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
