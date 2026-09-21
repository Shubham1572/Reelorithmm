import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.DATABASE_URL ||
  "mongodb://127.0.0.1:27017/reelorithmm";

const ReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    occupation: { type: String, trim: true, default: "Client" },
    email: { type: String, required: true, trim: true, lowercase: true },
    profileImage: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true, trim: true },
    approved: { type: Boolean, default: true, index: true },
    isPublished: { type: Boolean, default: true },
    verified: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "reviews" }
);

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema, "reviews");

const seedData = [
  {
    name: "Hasti Vora",
    occupation: "Podcaster",
    email: "hasti.vora@client.reelorithmm.com",
    rating: 5,
    review:
      "The podcast video quality is incredible! Professional editing, perfect lighting, and the final reels helped grow our audience significantly. Highly recommend for any content creator.",
    approved: true,
    isPublished: true,
    verified: true,
  },
  {
    name: "Yagnadeepsinh Sarvaiya",
    occupation: "Entrepreneur",
    email: "yagnadeepsinh@client.reelorithmm.com",
    rating: 5,
    review:
      "The quality and creativity exceeded all expectations. This videographer truly understands luxury branding and storytelling.",
    approved: true,
    isPublished: true,
    verified: true,
  },
  {
    name: "Delight Photography",
    occupation: "Studio & Photographer",
    email: "delight.photo@client.reelorithmm.com",
    rating: 5,
    review:
      "Outstanding collaboration! The video editing and color grading perfectly complemented our photography. The final product was breathtaking and our clients loved it. A true professional who understands visual storytelling.",
    approved: true,
    isPublished: true,
    verified: true,
  },
];

async function seed() {
  console.log("[Seed] Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log("[Seed] Connected successfully.");

  for (const item of seedData) {
    const existing = await Review.findOne({ name: item.name, review: item.review });
    if (!existing) {
      await Review.create(item);
      console.log(`[Seed] Created review for: ${item.name}`);
    } else {
      console.log(`[Seed] Review already exists for: ${item.name}`);
    }
  }

  const count = await Review.countDocuments();
  console.log(`[Seed] Done. Total reviews in collection: ${count}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[Seed] Error:", err.message);
  process.exit(1);
});
