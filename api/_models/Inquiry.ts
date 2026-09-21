import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInquiry extends Document {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  projectDetails: string;
  status: "new" | "contacted" | "in-progress" | "completed" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 100 },
    projectType: { type: String, required: true, trim: true },
    projectDetails: { type: String, required: true, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["new", "contacted", "in-progress", "completed", "archived"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

export const InquiryModel: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);
