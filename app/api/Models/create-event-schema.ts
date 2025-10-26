import mongoose, { Document, Schema, Model, model } from "mongoose";
import { CreateEventFormInputs } from "@/app/type/event";

export type EventDocumentType = CreateEventFormInputs & {
  createdBy: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
} & Document;

const CreateEventSchema: Schema<EventDocumentType> = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    venue: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true }
);

const CreateEventModel: Model<EventDocumentType> =
  mongoose.models.Event || model<EventDocumentType>("Event", CreateEventSchema);

export { CreateEventModel };
