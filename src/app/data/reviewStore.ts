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

const REVIEWS_STORAGE_KEY = "reelorithmm_reviews_v2";
const INQUIRIES_STORAGE_KEY = "reelorithmm_inquiries_v1";

export function getStoredReviews(): ReviewItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Error reading reviews from localStorage", e);
    return [];
  }
}

export function saveReview(newReviewData: Omit<ReviewItem, "id" | "createdAt">): ReviewItem {
  const currentReviews = getStoredReviews();
  const newReview: ReviewItem = {
    ...newReviewData,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString(),
    verified: true,
  };
  const updated = [newReview, ...currentReviews];
  if (typeof window !== "undefined") {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
  }
  return newReview;
}

export function calculateReviewStats(reviews: ReviewItem[]): ReviewStats {
  const total = reviews.length;
  if (total === 0) {
    return { totalReviews: 0, averageRating: 0, satisfactionPercentage: 0 };
  }
  const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
  const avg = sum / total;
  const highRatings = reviews.filter((r) => r.rating >= 4).length;
  const satPct = Math.round((highRatings / total) * 100);

  return {
    totalReviews: total,
    averageRating: parseFloat(avg.toFixed(1)),
    satisfactionPercentage: satPct,
  };
}

export async function fetchReviewsFromApi(): Promise<{ reviews: ReviewItem[]; stats: ReviewStats }> {
  try {
    const response = await fetch("/api/reviews", {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.reviews)) {
        return {
          reviews: data.reviews,
          stats: data.stats || calculateReviewStats(data.reviews),
        };
      }
    }
  } catch (e) {
    // API endpoint unavailable
  }
  const localReviews = getStoredReviews();
  return {
    reviews: localReviews,
    stats: calculateReviewStats(localReviews),
  };
}

export async function submitReviewToApi(payload: {
  name: string;
  occupation?: string;
  email: string;
  rating: number;
  review: string;
  avatarUrl?: string;
}): Promise<{ review: ReviewItem; stats: ReviewStats }> {
  try {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.review) {
        return {
          review: data.review,
          stats: data.stats,
        };
      }
    }
  } catch (e) {
    // Fallback to local store if API endpoint unavailable
  }

  const savedLocal = saveReview({
    name: payload.name,
    role: payload.occupation || "Client",
    rating: payload.rating,
    review: payload.review,
    image: payload.avatarUrl,
  });

  const updatedReviews = getStoredReviews();
  return {
    review: savedLocal,
    stats: calculateReviewStats(updatedReviews),
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
  } catch (e) {
    return [];
  }
}
