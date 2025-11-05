import mongoose, { Schema } from 'mongoose';


const registrationSchema = new Schema({
    studentId: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now }
});

const eventSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        location: { type: String, required: true },
        maxParticipants: { type: Number },
        registrations: [registrationSchema]
    },
    { timestamps: true }
);

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
