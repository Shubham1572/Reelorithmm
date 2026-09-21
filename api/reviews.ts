import { connectToDatabase } from "./_lib/db";
import { ReviewModel } from "./_models/Review";

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

// Safe body parser for Node HTTP, Connect middleware, and Vercel serverless
async function parseBody(req: any): Promise<any> {
  if (req.body) {
    if (typeof req.body === "object") {
      return req.body;
    }
    if (typeof req.body === "string") {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    if (Buffer.isBuffer(req.body)) {
      try {
        return JSON.parse(req.body.toString("utf-8"));
      } catch {
        return {};
      }
    }
  }

  // If the stream has already completed and req.body was not populated
  if (req.readableEnded || req.complete) {
    return {};
  }

  // Buffer readable stream with a 3-second safety timeout
  return new Promise((resolve) => {
    let raw = "";
    let finished = false;

    const timer = setTimeout(() => {
      if (!finished) {
        finished = true;
        resolve({});
      }
    }, 3000);

    req.on("data", (chunk: any) => {
      raw += chunk;
      // Protection against unreasonably huge payloads (> 5MB)
      if (raw.length > 5 * 1024 * 1024) {
        finished = true;
        clearTimeout(timer);
        resolve({});
      }
    });

    req.on("end", () => {
      if (!finished) {
        finished = true;
        clearTimeout(timer);
        try {
          resolve(raw ? JSON.parse(raw) : {});
        } catch {
          resolve({});
        }
      }
    });

    req.on("error", () => {
      if (!finished) {
        finished = true;
        clearTimeout(timer);
        resolve({});
      }
    });
  });
}

// Anti-spam best-effort rate limiting map (per serverless instance)
const rateLimitMap = new Map<string, number>();

function checkRateLimit(clientIp: string, windowMs = 10000): boolean {
  const now = Date.now();
  if (rateLimitMap.size > 500) {
    const cutoff = now - windowMs * 2;
    for (const [ip, time] of rateLimitMap.entries()) {
      if (time < cutoff) rateLimitMap.delete(ip);
    }
  }
  const lastSubmit = rateLimitMap.get(clientIp);
  if (lastSubmit && now - lastSubmit < windowMs) {
    return false;
  }
  rateLimitMap.set(clientIp, now);
  return true;
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }

  try {
    const conn = await connectToDatabase();

    if (!conn) {
      return sendJson(res, 503, {
        success: false,
        error: "Database unavailable",
        message: "Database connection could not be established. Please check database configuration.",
      });
    }

    if (req.method === "GET") {
      // Prevent stale caching on Vercel CDN and browsers
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      const url = req.url || "";
      const isStatsOnly = url.includes("/stats") || req.query?.action === "stats";

      // Query only approved & published reviews, excluding private emails
      const approvedReviews = await ReviewModel.find({
        approved: { $ne: false },
        isPublished: { $ne: false },
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
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        })),
      });
    }

    if (req.method === "POST") {
      const forwarded = req.headers["x-forwarded-for"];
      const clientIp = (typeof forwarded === "string" ? forwarded.split(",")[0] : req.socket?.remoteAddress || "ip").trim();

      if (!checkRateLimit(clientIp, 10000)) {
        return sendJson(res, 429, {
          success: false,
          error: "Please wait 10 seconds before submitting another review.",
        });
      }

      const body = await parseBody(req);
      const { name, occupation, email, rating, review, profileImage, avatarUrl } = body || {};

      if (!name || typeof name !== "string" || name.trim().length < 2) {
        return sendJson(res, 400, {
          success: false,
          error: "Please enter your name (at least 2 characters).",
        });
      }

      if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return sendJson(res, 400, {
          success: false,
          error: "A valid email address is required.",
        });
      }

      const numRating = Number(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return sendJson(res, 400, {
          success: false,
          error: "Rating must be between 1 and 5.",
        });
      }

      if (!review || typeof review !== "string" || review.trim().length < 15) {
        return sendJson(res, 400, {
          success: false,
          error: "Review text must be at least 15 characters.",
        });
      }

      if (review.trim().length > 500) {
        return sendJson(res, 400, {
          success: false,
          error: "Review text cannot exceed 500 characters.",
        });
      }

      const cleanName = sanitizeString(name.trim().slice(0, 80));
      const cleanOccupation = occupation ? sanitizeString(occupation.trim().slice(0, 100)) : "Client";
      const cleanReview = sanitizeString(review.trim().slice(0, 500));
      const rawImg = (profileImage || avatarUrl || "").trim();
      const imgUrl = rawImg.length > 0 ? rawImg : undefined;

      const newDoc = await ReviewModel.create({
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

      // Fetch fresh stats across all approved reviews
      const allApproved = await ReviewModel.find({
        approved: { $ne: false },
        isPublished: { $ne: false },
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
          id: newDoc._id.toString(),
          name: newDoc.name,
          role: newDoc.occupation,
          review: newDoc.review,
          rating: newDoc.rating,
          image: newDoc.profileImage || newDoc.avatarUrl || undefined,
          verified: true,
          createdAt: newDoc.createdAt ? new Date(newDoc.createdAt).toISOString() : new Date().toISOString(),
        },
        stats: {
          totalReviews,
          averageRating,
          satisfactionPercentage,
        },
      });
    }

    return sendJson(res, 405, { success: false, error: "Method Not Allowed" });
  } catch (error: any) {
    console.error("[Reviews API] Handler error:", error?.message || error);
    return sendJson(res, 500, {
      success: false,
      error: "Internal server error occurred while processing feedback.",
    });
  }
}
