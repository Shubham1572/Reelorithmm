export interface ReviewItem {
  id: string | number;
  name: string;
  role: string;
  image?: string;
  review: string;
  rating: number;
  createdAt: string;
  verified?: boolean;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  satisfactionPercentage: number;
  ratingDistribution?: Record<number, number>;
}

export interface InquiryItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  projectType: string;
  projectDetails: string;
  createdAt: string;
  status: "new" | "contacted" | "completed";
}

const INQUIRIES_STORAGE_KEY = "reelorithmm_inquiries_v1";

export function calculateReviewStats(reviews: ReviewItem[]): ReviewStats {
  const total = reviews.length;
  if (total === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      satisfactionPercentage: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }
  const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
  const avg = sum / total;
  const highRatings = reviews.filter((r) => r.rating >= 4).length;
  const satPct = Math.round((highRatings / total) * 100);

  return {
    totalReviews: total,
    averageRating: parseFloat(avg.toFixed(1)),
    satisfactionPercentage: satPct,
    ratingDistribution: {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    },
  };
}

/**
 * Fetch reviews directly from the MongoDB-backed API.
 * Ensures fresh data with no-store caching to support multi-user consistency.
 */
export async function fetchReviewsFromApi(): Promise<{ reviews: ReviewItem[]; stats: ReviewStats }> {
  try {
    const response = await fetch("/api/reviews", {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.reviews)) {
        return {
          reviews: data.reviews,
          stats: data.stats || calculateReviewStats(data.reviews),
        };
      }
    } else {
      console.warn("[Reviews] Failed to fetch reviews:", response.status, response.statusText);
    }
  } catch (e: any) {
    console.error("[Reviews] Network error fetching reviews from API:", e?.message || e);
  }

  // If database is empty or initial connection has no reviews
  return {
    reviews: [],
    stats: {
      totalReviews: 0,
      averageRating: 0,
      satisfactionPercentage: 0,
    },
  };
}

/**
 * Submit dynamic user review to MongoDB via the /api/reviews endpoint.
 * STRICT: Does NOT fall back to localStorage. Throws an explicit error if database save fails.
 */
export async function submitReviewToApi(payload: {
  name: string;
  occupation?: string;
  email: string;
  rating: number;
  review: string;
  avatarUrl?: string;
}): Promise<{ review: ReviewItem; stats: ReviewStats }> {
  let response: Response;

  try {
    response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (netErr: any) {
    throw new Error("Unable to connect to the server. Please check your internet connection.");
  }

  let data: any = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok || !data.success) {
    const errorMessage =
      data.error ||
      data.message ||
      (response.status === 503
        ? "Database is temporarily unavailable. Please try again in a few moments."
        : `Submission failed (${response.status})`);
    throw new Error(errorMessage);
  }

  if (!data.review) {
    throw new Error("Server did not return the saved review document.");
  }

  return {
    review: data.review,
    stats: data.stats || calculateReviewStats([data.review]),
  };
}

export function saveInquiry(inquiryData: Omit<InquiryItem, "id" | "createdAt" | "status">): InquiryItem {
  const inquiry: InquiryItem = {
    ...inquiryData,
    id: `inq-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(inquiry);
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Error saving inquiry to localStorage", e);
    }
  }
  return inquiry;
}

export function getStoredInquiries(): InquiryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
