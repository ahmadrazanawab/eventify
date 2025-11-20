import mongoose, { Schema } from "mongoose";

const AnnouncementSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    audience: { type: String, enum: ["All", "Students", "Admins"], default: "All" },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    publishAt: { type: Date },
  },
  { timestamps: true }
);

const AnnouncementModel = mongoose.models.Announcement || mongoose.model("Announcement", AnnouncementSchema);
export { AnnouncementModel };
