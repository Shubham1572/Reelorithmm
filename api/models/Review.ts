import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  name: string;
  occupation?: string;
  email: string;
  profileImage?: string;
  avatarUrl?: string;
  rating: number;
  review: string;
  approved: boolean;
  isPublished: boolean;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema<IReview> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    occupation: {
      type: String,
      trim: true,
      maxlength: [100, "Occupation cannot exceed 100 characters"],
      default: "Client",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      select: false, // Never return email by default in queries
    },
    profileImage: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    review: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
      minlength: [15, "Review text must be at least 15 characters"],
      maxlength: [500, "Review text cannot exceed 500 characters"],
    },
    approved: {
      type: Boolean,
      default: true,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "reviews",
  }
);

// Create compound index for fast queries sorting newest approved reviews
ReviewSchema.index({ approved: 1, isPublished: 1, createdAt: -1 });

export const ReviewModel: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema, "reviews");
