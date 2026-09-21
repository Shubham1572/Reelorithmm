import { connectToDatabase } from "./lib/db";
import { InquiryModel } from "./models/Inquiry";

function sanitizeString(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

function sendJson(res: any, code: number, data: any) {
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(code).json(data);
  }
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

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
        message: "MONGODB_URI environment variable not configured or MongoDB server offline",
      });
    }

    // Ensure inquiries collection exists in MongoDB database
    await InquiryModel.createCollection().catch(() => {});

    if (req.method === "GET") {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      const inquiries = await InquiryModel.find().sort({ createdAt: -1 }).limit(100).lean();
      return sendJson(res, 200, {
        success: true,
        count: inquiries.length,
        inquiries: inquiries.map((item) => ({
          id: item._id.toString(),
          name: item.name,
          phone: item.phone,
          email: item.email,
          projectType: item.projectType,
          projectDetails: item.projectDetails,
          status: item.status,
          createdAt: item.createdAt,
        })),
      });
    }

    if (req.method === "POST") {
      const clientIp = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "ip").toString();
      const lastSubmit = rateLimitMap.get(clientIp);
      const now = Date.now();

      if (lastSubmit && now - lastSubmit < 10000) {
        return sendJson(res, 429, {
          error: "Please wait 10 seconds before submitting another inquiry.",
        });
      }
      rateLimitMap.set(clientIp, now);

      let body: any = req.body;
      if (body) {
        if (typeof body === "string") {
          try {
            body = JSON.parse(body);
          } catch {
            body = {};
          }
        } else if (Buffer.isBuffer(body)) {
          try {
            body = JSON.parse(body.toString("utf-8"));
          } catch {
            body = {};
          }
        }
      } else if (!req.readableEnded && !req.complete) {
        body = await new Promise((resolve) => {
          let data = "";
          const timer = setTimeout(() => resolve({}), 3000);
          req.on("data", (chunk: any) => (data += chunk));
          req.on("end", () => {
            clearTimeout(timer);
            try {
              resolve(JSON.parse(data));
            } catch {
              resolve({});
            }
          });
          req.on("error", () => {
            clearTimeout(timer);
            resolve({});
          });
        });
      } else {
        body = {};
      }

      const { name, phone, email, projectType, message, projectDetails } = body || {};
      const detailsText = message || projectDetails;

      if (!name || typeof name !== "string" || name.trim().length < 2) {
        return sendJson(res, 400, { error: "Please enter your full name." });
      }

      if (!phone || typeof phone !== "string" || phone.trim().length < 5) {
        return sendJson(res, 400, { error: "Please enter a valid phone number." });
      }

      if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return sendJson(res, 400, { error: "Please enter a valid email address." });
      }

      if (!projectType || typeof projectType !== "string") {
        return sendJson(res, 400, { error: "Please select a project type." });
      }

      if (!detailsText || typeof detailsText !== "string" || detailsText.trim().length < 5) {
        return sendJson(res, 400, { error: "Please provide project details." });
      }

      const cleanName = sanitizeString(name.trim().slice(0, 100));
      const cleanPhone = sanitizeString(phone.trim().slice(0, 30));
      const cleanEmail = email.trim().toLowerCase();
      const cleanProjectType = sanitizeString(projectType.trim().slice(0, 50));
      const cleanDetails = sanitizeString(detailsText.trim().slice(0, 2000));

      const newInquiry = await InquiryModel.create({
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        projectType: cleanProjectType,
        projectDetails: cleanDetails,
        status: "new",
      });

      return sendJson(res, 201, {
        success: true,
        message: "Inquiry saved to database successfully",
        inquiryId: newInquiry._id.toString(),
      });
    }

    return sendJson(res, 405, { error: "Method Not Allowed" });
  } catch (error: any) {
    console.error("API error in /api/inquiries:", error);
    return sendJson(res, 500, { error: "Internal Server Error", message: error.message });
  }
}
