import { connectToDatabase } from "./lib/db";
import { ReviewModel } from "./models/Review";

// HTML/script sanitizer against XSS
function sanitizeString(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Universal JSON response sender compatible with Express, Vercel, and raw Node http.ServerResponse
function sendJson(res: any, code: number, data: any) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(code).json(data);
  }
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

// Anti-spam rate limiting map
const rateLimitMap = new Map<string, number>();

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }

  try {
    const conn = await connectToDatabase();

    if (!conn) {
      return sendJson(res, 503, {
        error: "Database unavailable",
        message: "MONGODB_URI environment variable not configured or local MongoDB offline",
      });
    }

    if (req.method === "GET") {
      const url = req.url || "";
      const isStatsOnly = url.includes("/stats") || req.query?.action === "stats";

      const approvedReviews = await ReviewModel.find({
        $or: [{ approved: { $ne: false } }, { isPublished: { $ne: false } }],
      })
        .select("-email")
        .sort({ createdAt: -1 })
        .lean();

      const totalReviews = approvedReviews.length;
      const sumRating = approvedReviews.reduce((acc, r) => acc + (r.rating || 5), 0);
      const averageRating = totalReviews > 0 ? parseFloat((sumRating / totalReviews).toFixed(1)) : 0;
      const highRatingCount = approvedReviews.filter((r) => r.rating >= 4).length;
      const satisfactionPercentage = totalReviews > 0 ? Math.round((highRatingCount / totalReviews) * 100) : 0;

      const ratingDistribution = {
        5: approvedReviews.filter((r) => r.rating === 5).length,
        4: approvedReviews.filter((r) => r.rating === 4).length,
        3: approvedReviews.filter((r) => r.rating === 3).length,
        2: approvedReviews.filter((r) => r.rating === 2).length,
        1: approvedReviews.filter((r) => r.rating === 1).length,
      };

      const stats = {
        totalReviews,
        averageRating,
        satisfactionPercentage,
        ratingDistribution,
      };

      if (isStatsOnly) {
        return sendJson(res, 200, { success: true, stats });
      }

      return sendJson(res, 200, {
        success: true,
        stats,
        reviews: approvedReviews.map((r) => ({
          id: r._id.toString(),
          name: r.name,
          role: r.occupation || "Client",
          review: r.review,
          rating: r.rating,
          image: r.profileImage || r.avatarUrl || undefined,
          verified: r.verified !== false,
          createdAt: r.createdAt,
        })),
      });
    }

    if (req.method === "POST") {
      const clientIp = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "ip").toString();
      const lastSubmit = rateLimitMap.get(clientIp);
      const now = Date.now();

      if (lastSubmit && now - lastSubmit < 15000) {
        return sendJson(res, 429, {
          error: "Rate limit exceeded. Please wait 15 seconds before submitting another review.",
        });
      }
      rateLimitMap.set(clientIp, now);

      // Parse request body for Node HTTP or Vercel environment
      let body = req.body;
      if (!body) {
        body = await new Promise((resolve) => {
          let data = "";
          req.on("data", (chunk: any) => (data += chunk));
          req.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve({});
            }
          });
        });
      } else if (typeof body === "string") {
        try {
          body = JSON.parse(body);
        } catch (e) {
          body = {};
        }
      }

      const { name, occupation, email, rating, review, profileImage, avatarUrl } = body || {};

      if (!name || typeof name !== "string" || name.trim().length < 2) {
        return sendJson(res, 400, { error: "Please enter your name (at least 2 characters)." });
      }

      if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return sendJson(res, 400, { error: "A valid email address is required." });
      }

      const numRating = Number(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return sendJson(res, 400, { error: "Rating must be between 1 and 5." });
      }

      if (!review || typeof review !== "string" || review.trim().length < 15 || review.trim().length > 500) {
        return sendJson(res, 400, { error: "Review text must be between 15 and 500 characters." });
      }

      const cleanName = sanitizeString(name.trim().slice(0, 80));
      const cleanOccupation = occupation ? sanitizeString(occupation.trim().slice(0, 100)) : "Client";
      const cleanReview = sanitizeString(review.trim().slice(0, 500));
      const imgUrl = (profileImage || avatarUrl || "").trim() || undefined;

      const newReview = await ReviewModel.create({
        name: cleanName,
        occupation: cleanOccupation,
        email: email.trim().toLowerCase(),
        profileImage: imgUrl,
        avatarUrl: imgUrl,
        rating: numRating,
        review: cleanReview,
        approved: true,
        isPublished: true,
        verified: true,
      });

      const allApproved = await ReviewModel.find({
        $or: [{ approved: { $ne: false } }, { isPublished: { $ne: false } }],
      }).lean();
      const totalReviews = allApproved.length;
      const sumRating = allApproved.reduce((acc, r) => acc + (r.rating || 5), 0);
      const averageRating = totalReviews > 0 ? parseFloat((sumRating / totalReviews).toFixed(1)) : 0;
      const highRatingCount = allApproved.filter((r) => r.rating >= 4).length;
      const satisfactionPercentage = totalReviews > 0 ? Math.round((highRatingCount / totalReviews) * 100) : 0;

      return sendJson(res, 201, {
        success: true,
        message: "Review submitted successfully!",
        review: {
          id: newReview._id.toString(),
          name: newReview.name,
          role: newReview.occupation,
          review: newReview.review,
          rating: newReview.rating,
          image: newReview.profileImage || newReview.avatarUrl || undefined,
          verified: true,
          createdAt: newReview.createdAt,
        },
        stats: {
          totalReviews,
          averageRating,
          satisfactionPercentage,
        },
      });
    }

    return sendJson(res, 405, { error: "Method Not Allowed" });
  } catch (error: any) {
    console.error("API error in /api/reviews:", error);
    return sendJson(res, 500, { error: "Internal Server Error", message: error.message });
  }
}
