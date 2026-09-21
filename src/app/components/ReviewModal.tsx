import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { submitReviewToApi, ReviewItem, ReviewStats } from "../data/reviewStore";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewAdded: (review: ReviewItem, stats?: ReviewStats) => void;
}

const MAX_REVIEW_LENGTH = 500;
const MIN_REVIEW_LENGTH = 15;

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Excellent",
};

export function ReviewModal({ isOpen, onClose, onReviewAdded }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [email, setEmail] = useState("");
  const [review, setReview] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ESC key listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file (JPEG, PNG, WEBP).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const rawSrc = reader.result as string;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 250;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.85);
            setImagePreview(compressed);
          } else {
            setImagePreview(rawSrc);
          }
        };
        img.onerror = () => setImagePreview(rawSrc);
        img.src = rawSrc;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitStatus === "submitting") return;

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage("Please enter your name (at least 2 characters).");
      setSubmitStatus("error");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      setSubmitStatus("error");
      return;
    }
    if (!review.trim() || review.trim().length < MIN_REVIEW_LENGTH) {
      setErrorMessage(`Please write at least ${MIN_REVIEW_LENGTH} characters.`);
      setSubmitStatus("error");
      return;
    }

    setSubmitStatus("submitting");
    setErrorMessage("");

    try {
      const result = await submitReviewToApi({
        name: name.trim(),
        occupation: occupation.trim() || "Client",
        email: email.trim(),
        rating,
        review: review.trim(),
        avatarUrl: imagePreview || undefined,
      });

      setSubmitStatus("success");
      onReviewAdded(result.review, result.stats);

      setTimeout(() => {
        // Reset form
        setName("");
        setOccupation("");
        setEmail("");
        setReview("");
        setImagePreview(null);
        setRating(5);
        setSubmitStatus("idle");
        onClose();
      }, 1500);
    } catch (err: any) {
      setSubmitStatus("error");
      setErrorMessage(err.message || "Failed to submit feedback. Please try again.");
    }
  };

  const activeRatingDisplay = hoverRating || rating;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl bg-secondary-dark/95 border border-teal-accent/30 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl max-h-[92vh] flex flex-col justify-between overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-cream/60 hover:text-gold-accent transition-colors focus:outline-none z-10"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-4 flex-shrink-0">
              <h3
                className="text-2xl sm:text-3xl text-cream font-semibold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Share Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-accent to-cream">
                  Experience
                </span>
              </h3>
              <p className="text-cream/70 text-xs sm:text-sm mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Tell us how your experience with Reelorithmm was.
              </p>
            </div>

            {submitStatus === "success" ? (
              <div className="py-10 text-center flex flex-col items-center justify-center gap-3 my-auto">
                <CheckCircle2 className="w-14 h-14 text-teal-accent animate-bounce" />
                <h4 className="text-2xl text-cream font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ✓ Thank you for sharing your experience.
                </h4>
                <p className="text-cream/80 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Your review has been submitted successfully.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between overflow-hidden">
                {/* 5-Star Interactive Rating Bar */}
                <div className="flex items-center justify-between bg-primary-dark/60 px-5 py-3 rounded-xl border border-teal-accent/25">
                  <span className="text-xs uppercase tracking-wider text-gold-accent font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Your Rating *
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-gold-accent hover:scale-110 transition-transform focus:outline-none"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          className={`w-7 h-7 ${
                            activeRatingDisplay >= star ? "fill-gold-accent text-gold-accent" : "text-cream/25"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs sm:text-sm text-gold-accent font-semibold ml-2 min-w-[75px] text-right" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {RATING_LABELS[activeRatingDisplay]}
                    </span>
                  </div>
                </div>

                {/* Name & Role Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-cream/90 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 bg-primary-dark/60 border border-teal-accent/30 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold-accent text-sm"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-cream/90 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Role / Company
                    </label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="e.g. Groom / Brand"
                      className="w-full px-4 py-2.5 bg-primary-dark/60 border border-teal-accent/30 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold-accent text-sm"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>
                </div>

                {/* Email & Photo Upload Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-medium text-cream/90 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Email * <span className="text-[10px] text-cream/50">(Kept Private)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 bg-primary-dark/60 border border-teal-accent/30 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold-accent text-sm"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-cream/90 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Profile Photo <span className="text-[10px] text-cream/50">(Optional)</span>
                    </label>
                    <div className="flex items-center gap-3">
                      {imagePreview ? (
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-gold-accent flex-shrink-0">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setImagePreview(null)}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center text-cream opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2.5 px-4 bg-primary-dark/40 border border-dashed border-teal-accent/40 hover:border-gold-accent rounded-xl text-cream/70 hover:text-cream text-xs flex items-center justify-center gap-2 transition-colors"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          <Upload className="w-4 h-4 text-gold-accent" />
                          <span>Upload Photo</span>
                        </button>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>
                  </div>
                </div>

                {/* Review Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-cream/90" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Your Review *
                    </label>
                    <span className={`text-[11px] ${review.length >= MAX_REVIEW_LENGTH ? "text-red-400 font-bold" : "text-cream/50"}`}>
                      {review.length} / {MAX_REVIEW_LENGTH}
                    </span>
                  </div>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value.slice(0, MAX_REVIEW_LENGTH))}
                    required
                    rows={3.5}
                    placeholder="Tell us about your experience working with Reelorithmm…"
                    className="w-full px-4 py-2.5 bg-primary-dark/60 border border-teal-accent/30 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold-accent text-sm resize-none"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>

                {/* Error Banner */}
                {submitStatus === "error" && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-300 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage || "Something went wrong."}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitStatus === "submitting"}
                  className="w-full py-3.5 bg-gradient-to-r from-teal-accent to-gold-accent text-primary-dark font-semibold text-base rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(3,101,100,0.5)] disabled:opacity-60 mt-1"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {submitStatus === "submitting" ? "Submitting…" : "Share My Experience"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
