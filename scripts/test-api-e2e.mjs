import handler from "../api/reviews.js"; // or ts
import feedbackHandler from "../api/feedback.js";
import inquiriesHandler from "../api/inquiries.js";
import { ReviewModel } from "../api/_models/Review.js";
import mongoose from "mongoose";

// Mock response object to capture status, headers, and json
function createMockRes() {
  const headers = {};
  const res = {
    statusCode: 200,
    headers,
    setHeader(name, value) {
      headers[name.toLowerCase()] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.jsonData = data;
      return this;
    },
    end(data) {
      if (data && !this.jsonData) {
        try {
          this.jsonData = JSON.parse(data);
        } catch {
          this.rawEnd = data;
        }
      }
      return this;
    },
  };
  return res;
}

async function runTests() {
  console.log("=== STARTING FULL END-TO-END FEEDBACK & MONGODB AUDIT ===");

  // 1. Check initial GET /api/reviews
  console.log("\n[Test 1] Testing GET /api/reviews (Read-Only)...");
  const reqGet1 = { method: "GET", url: "/api/reviews", headers: {} };
  const resGet1 = createMockRes();
  await handler(reqGet1, resGet1);

  console.log("GET status:", resGet1.statusCode);
  console.log("Cache-Control header:", resGet1.headers["cache-control"]);
  console.log("Success:", resGet1.jsonData?.success);
  console.log("Total reviews found in MongoDB:", resGet1.jsonData?.reviews?.length);
  if (resGet1.statusCode !== 200 || !resGet1.jsonData?.success) {
    throw new Error(`GET /api/reviews failed with status ${resGet1.statusCode}`);
  }
  const initialCount = resGet1.jsonData.reviews.length;

  // 2. Test POST /api/reviews validation (reject malformed input)
  console.log("\n[Test 2] Testing POST /api/reviews validation rejection...");
  const reqPostInvalid = {
    method: "POST",
    headers: {},
    body: {
      name: "A", // too short (must be >= 2)
      email: "not-an-email",
      rating: 6, // invalid rating
      review: "Too short", // < 15 chars
    },
  };
  const resPostInvalid = createMockRes();
  await handler(reqPostInvalid, resPostInvalid);
  console.log("Invalid POST status:", resPostInvalid.statusCode);
  console.log("Rejection error message:", resPostInvalid.jsonData?.error);
  if (resPostInvalid.statusCode !== 400) {
    throw new Error(`Validation failed to reject bad input, got ${resPostInvalid.statusCode}`);
  }

  // 3. Test POST /api/reviews with valid payload
  console.log("\n[Test 3] Testing POST /api/reviews with valid dynamic feedback...");
  const uniqueTestEmail = `test.reviewer.${Date.now()}@example.com`;
  const testReviewText = `E2E verification of Reelorithmm feedback persistence at ${new Date().toISOString()}. The cinematography and pacing are world class!`;
  const reqPostValid = {
    method: "POST",
    headers: {
      "x-forwarded-for": `192.168.1.${Math.floor(Math.random() * 200)}`,
    },
    body: {
      name: "Priya Patel",
      occupation: "Creative Director",
      email: uniqueTestEmail,
      rating: 5,
      review: testReviewText,
    },
  };
  const resPostValid = createMockRes();
  await handler(reqPostValid, resPostValid);
  console.log("Valid POST status:", resPostValid.statusCode);
  console.log("Response review ID:", resPostValid.jsonData?.review?.id);
  console.log("Response review name:", resPostValid.jsonData?.review?.name);
  if (resPostValid.statusCode !== 201 || !resPostValid.jsonData?.review?.id) {
    throw new Error(`Valid POST failed with status ${resPostValid.statusCode}: ${JSON.stringify(resPostValid.jsonData)}`);
  }
  const createdReviewId = resPostValid.jsonData.review.id;

  // 4. Test GET /api/reviews after POST (verify review appears in MongoDB query)
  console.log("\n[Test 4] Testing GET /api/reviews after POST (verifying immediate queryability)...");
  const reqGet2 = { method: "GET", url: "/api/reviews", headers: {} };
  const resGet2 = createMockRes();
  await handler(reqGet2, resGet2);
  console.log("GET status:", resGet2.statusCode);
  console.log("Total reviews after POST:", resGet2.jsonData?.reviews?.length);
  const found = resGet2.jsonData?.reviews?.find((r) => r.id === createdReviewId);
  if (!found) {
    throw new Error(`Created review ID ${createdReviewId} was not found in GET response!`);
  }
  console.log("Verified: newly submitted review is present in GET list!");
  console.log("Reviewer:", found.name, "| Role:", found.role, "| Rating:", found.rating);

  // 5. Test persistence after disconnecting MongoDB connection (simulating process restart)
  console.log("\n[Test 5] Simulating connection termination and reconnect (process restart persistence)...");
  await mongoose.disconnect();
  console.log("Mongoose disconnected. Current readyState:", mongoose.connection.readyState);

  const reqGet3 = { method: "GET", url: "/api/reviews", headers: {} };
  const resGet3 = createMockRes();
  await handler(reqGet3, resGet3);
  console.log("Reconnected GET status:", resGet3.statusCode);
  const foundAfterReconnect = resGet3.jsonData?.reviews?.find((r) => r.id === createdReviewId);
  if (!foundAfterReconnect) {
    throw new Error("Review did not persist in MongoDB across disconnect/reconnect!");
  }
  console.log("Verified: review persisted in MongoDB and was retrieved after fresh connection!");

  // 6. Test /api/feedback alias
  console.log("\n[Test 6] Testing /api/feedback alias...");
  const reqFeedback = { method: "GET", url: "/api/feedback", headers: {} };
  const resFeedback = createMockRes();
  await feedbackHandler(reqFeedback, resFeedback);
  console.log("/api/feedback status:", resFeedback.statusCode);
  console.log("/api/feedback total reviews:", resFeedback.jsonData?.reviews?.length);
  if (resFeedback.statusCode !== 200 || !resFeedback.jsonData?.success) {
    throw new Error("/api/feedback alias failed");
  }

  // 7. Test seed script execution
  console.log("\n[Test 7] Verifying one-time seed mechanism...");
  const seedNames = ["Hasti Vora", "Yagnadeepsinh Sarvaiya", "Delight Photography"];
  for (const name of seedNames) {
    const exists = await ReviewModel.findOne({ name });
    console.log(`Seed testimonial "${name}":`, exists ? "Present in MongoDB" : "Not yet seeded");
  }

  // 8. Test GET /api/inquiries
  console.log("\n[Test 8] Testing GET /api/inquiries...");
  const reqInquiries = { method: "GET", url: "/api/inquiries", headers: {} };
  const resInquiries = createMockRes();
  await inquiriesHandler(reqInquiries, resInquiries);
  console.log("GET /api/inquiries status:", resInquiries.statusCode);
  console.log("Total inquiries in MongoDB:", resInquiries.jsonData?.count);
  if (resInquiries.statusCode !== 200 || !resInquiries.jsonData?.success) {
    throw new Error("/api/inquiries GET failed");
  }

  console.log("\n=== ALL E2E API AND MONGODB TESTS PASSED SUCCESSFULLY! ===");
  await mongoose.disconnect();
}

runTests().catch(async (err) => {
  console.error("\nTEST FAILED:", err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
