import mongoose, { Document, Schema, Model, model } from "mongoose";
import { CreateEventFormInputs } from "@/app/type/event";

// Event document interface for TypeScript
export interface EventDocument extends CreateEventFormInputs, Document {
  createdBy: mongoose.Types.ObjectId;        // Admin who created the event
  participants: mongoose.Types.ObjectId[];   // Array of student IDs
}

// Event schema
const CreateEventSchema: Schema<EventDocument> = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    venue: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },  // Admin reference
    participants: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }], // Student references
  },
  { timestamps: true }
);

// Create or reuse model
const CreateEventModel: Model<EventDocument> =
  mongoose.models.Event || model<EventDocument>("Event", CreateEventSchema);

export { CreateEventModel };
