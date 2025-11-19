import mongoose, { Document, Schema, Model, model, Types } from "mongoose";



// Define the schema
const CreateEventSchema = new Schema(
  {
    title: { type: String, required: [true, 'Title is required'] },
    category: { type: String, required: [true, 'Category is required'] },
    date: { type: String, required: [true, 'Date is required'] },
    time: { type: String, required: [true, 'Time is required'] },
    location: { type: String, required: [true, 'Location is required'] },
    venue: { type: String, required: [true, 'Venue is required'] },
    description: { type: String, required: [true, 'Description is required'] },
    maxParticipants: { type: Number },
    image: { type: String },
    paymentRequired: { type: Boolean, default: false },
    fee: { type: Number, default: 0 },
    status: { 
      type: String, 
      enum: ['draft', 'published', 'cancelled'],
      default: 'draft' 
    },
    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'SignUp', 
      required: [true, 'Creator ID is required'] 
    },
    participants: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'SignUp', 
      default: [] 
    }],
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create and export the model
const CreateEventModel = mongoose.models.Event || model('Event', CreateEventSchema);

export { CreateEventModel }; 

