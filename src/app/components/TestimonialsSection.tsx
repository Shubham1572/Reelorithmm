import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, PlusCircle, Quote, X, Users, Check } from "lucide-react";
import { fetchReviewsFromApi, ReviewItem, ReviewStats, calculateReviewStats } from "../data/reviewStore";
import { ReviewModal } from "./ReviewModal";

function MonogramAvatar({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

  return (
    <div
      className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-accent to-gold-accent flex items-center justify-center text-primary-dark font-bold text-base border-2 border-gold-accent/50 flex-shrink-0 shadow-md"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {initials || "R"}
    </div>
  );
}

function ViewportAnimatedCounter({ value, duration = 1200, decimals = 0 }: { value: number; duration?: number; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setCount(value);
      return;
    }

    if (!isInView || value === 0) {
      setCount(value);
      return;
    }

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Cubic-bezier easeOut curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = easeOut * value;
      setCount(current);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toFixed(decimals)}</span>;
}

function CardSkeleton() {
  return (
    <div className="w-full p-7 bg-secondary-dark/40 border border-teal-accent/20 rounded-2xl animate-pulse flex flex-col justify-between h-[290px] flex-shrink-0">
      <div>
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-teal-accent/20 rounded-full" />
          ))}
        </div>
        <div className="h-4 bg-cream/10 rounded w-full mb-2" />
        <div className="h-4 bg-cream/10 rounded w-4/5 mb-2" />
        <div className="h-4 bg-cream/10 rounded w-2/3" />
      </div>
      <div className="pt-4 border-t border-teal-accent/10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-teal-accent/20" />
        <div className="space-y-2">
          <div className="h-4 bg-cream/20 rounded w-28" />
          <div className="h-3 bg-gold-accent/20 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const sliderRef = useRef<HTMLDivElement>(null);

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ totalReviews: 0, averageRating: 0, satisfactionPercentage: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewForModal, setSelectedReviewForModal] = useState<ReviewItem | null>(null);

  // Mouse Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Nav arrow disable states
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fetch reviews from MongoDB API
  const loadReviews = useCallback(async () => {
    setLoading(true);
    const data = await fetchReviewsFromApi();
    setReviews(data.reviews);
    setStats(data.stats);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Check scroll positions for disabling arrows
  const checkScroll = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [reviews, checkScroll]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth * 0.85; // Scroll approx one card
    const amount = direction === "left" ? -cardWidth : cardWidth;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = sliderRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeftState - walk;
  };

  // Keyboard navigation listener
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      scrollByAmount("left");
    } else if (e.key === "ArrowRight") {
      scrollByAmount("right");
    }
  };

  // Immediate state update upon review submission
  const handleReviewAdded = (newReview: ReviewItem, updatedStats?: ReviewStats) => {
    setReviews((prev) => [newReview, ...prev]);
    if (updatedStats) {
      setStats(updatedStats);
    } else {
      setStats((prev) => calculateReviewStats([newReview, ...reviews]));
    }
  };

  return (
    <section id="reviews" ref={sectionRef} className="relative bg-primary-dark py-24 px-6 overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-accent/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold-accent/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <span
            className="text-xs uppercase tracking-widest text-gold-accent font-semibold mb-2 block"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Real Client Experiences
          </span>
          <h2
            className="text-5xl md:text-6xl text-cream mb-4 font-semibold tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            CLIENT{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-accent via-cream to-gold-accent">
              STORIES
            </span>
          </h2>
          <p
            className="text-lg md:text-xl text-cream/80 max-w-2xl mx-auto"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            What creators, brands, and couples say about working with Reelorithmm
          </p>
        </motion.div>

        {/* Dynamic 3-Metric Statistics Container (Above Cards) */}
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl mx-auto mb-16 p-6 sm:p-8 bg-secondary-dark/70 backdrop-blur-xl border border-teal-accent/30 rounded-2xl shadow-2xl grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 items-center text-center"
        >
          {/* Metric 1: Average Rating */}
          <div className="flex items-center gap-3.5 justify-center sm:justify-start">
            <Star className="w-8 h-8 fill-gold-accent text-gold-accent flex-shrink-0" />
            <div>
              <div className="text-cream text-2xl md:text-3xl font-bold whitespace-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}>
                {stats.totalReviews > 0 ? (
                  <>
                    <ViewportAnimatedCounter value={stats.averageRating} decimals={1} duration={1200} />
                    <span className="text-gold-accent"> / 5.0</span>
                  </>
                ) : (
                  <span className="text-cream/60 text-xl font-normal">— / 5.0</span>
                )}
              </div>
              <div className="text-[11px] sm:text-xs text-cream/70 uppercase tracking-wider font-medium whitespace-nowrap" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Average Rating
              </div>
            </div>
          </div>

          {/* Metric 2: Total Reviews */}
          <div className="flex items-center gap-3.5 justify-center sm:justify-start sm:border-l sm:border-teal-accent/20 sm:pl-6 lg:pl-10">
            <Users className="w-7 h-7 text-teal-accent flex-shrink-0" />
            <div>
              <div className="text-cream text-2xl md:text-3xl font-bold whitespace-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}>
                <ViewportAnimatedCounter value={stats.totalReviews} decimals={0} duration={1200} />
              </div>
              <div className="text-[11px] sm:text-xs text-cream/70 uppercase tracking-wider font-medium whitespace-nowrap" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Total Reviews
              </div>
            </div>
          </div>

          {/* Metric 3: Client Satisfaction */}
          <div className="flex items-center gap-3.5 justify-center sm:justify-start sm:border-l sm:border-teal-accent/20 sm:pl-6 lg:pl-10">
            <Check className="w-7 h-7 text-gold-accent flex-shrink-0" />
            <div>
              <div className="text-cream text-2xl md:text-3xl font-bold whitespace-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}>
                {stats.totalReviews > 0 ? (
                  <>
                    <ViewportAnimatedCounter value={stats.satisfactionPercentage} decimals={0} duration={1200} />
                    <span className="text-gold-accent">%</span>
                  </>
                ) : (
                  <span className="text-cream/60 text-xl font-normal">—</span>
                )}
              </div>
              <div className="text-[11px] sm:text-xs text-cream/70 uppercase tracking-wider font-medium whitespace-nowrap" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Client Satisfaction
              </div>
            </div>
          </div>
        </motion.div>

        {/* Carousel Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : reviews.length === 0 ? (
          /* 0-Review Empty State */
          <div className="text-center py-16 px-6 bg-secondary-dark/30 border border-teal-accent/20 rounded-2xl max-w-xl mx-auto shadow-xl">
            <Quote className="w-12 h-12 text-gold-accent/40 mx-auto mb-4" />
            <h3
              className="text-2xl text-cream mb-2 font-semibold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your story could be here.
            </h3>
            <p className="text-cream/70 text-sm mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Be the first to share your experience with Reelorithmm.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-accent to-gold-accent text-primary-dark font-semibold rounded-full shadow-lg transition-transform duration-300 hover:scale-105"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <PlusCircle className="w-5 h-5" />
              <span>Share Your Experience</span>
            </button>
          </div>
        ) : (
          /* Modern Interactive Horizontal Carousel */
          <div>
            <div className="relative group">
              {/* Left Edge Floating Arrow Control */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollByAmount("left")}
                  aria-label="Previous reviews"
                  className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-secondary-dark border border-teal-accent/40 text-gold-accent shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 hover:border-gold-accent focus:outline-none"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Right Edge Floating Arrow Control */}
              {canScrollRight && (
                <button
                  onClick={() => scrollByAmount("right")}
                  aria-label="Next reviews"
                  className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-secondary-dark border border-teal-accent/40 text-gold-accent shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 hover:border-gold-accent focus:outline-none"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Draggable & Swipable Horizontal Slider Track */}
              <div
                ref={sliderRef}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
                className={`flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-2 px-1 focus:outline-none select-none scrollbar-none ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={{
                  touchAction: "pan-y",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {reviews.map((testimonial, index) => {
                  const isLong = testimonial.review.length > 140;
                  const displayReview = isLong ? `${testimonial.review.slice(0, 140)}...` : testimonial.review;

                  return (
                    <div
                      key={`${testimonial.id}-${index}`}
                      className="w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0 snap-start flex flex-col"
                    >
                      <div className="relative w-full h-full p-7 bg-secondary-dark/50 backdrop-blur-md border border-teal-accent/30 rounded-2xl overflow-hidden transition-all duration-500 hover:border-gold-accent/50 hover:shadow-[0_0_30px_rgba(205,179,128,0.15)] hover:-translate-y-1 flex flex-col justify-between min-h-[290px]">
                        <Quote className="absolute top-6 right-6 w-10 h-10 text-teal-accent/20 pointer-events-none" />

                        <div>
                          {/* Dynamic Rating Stars */}
                          <div className="flex gap-1 mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-gold-accent text-gold-accent" />
                            ))}
                          </div>

                          {/* Review Content */}
                          <p
                            className="text-cream/90 leading-relaxed mb-3 italic text-base font-light"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            "{displayReview}"
                          </p>

                          {isLong && (
                            <button
                              onClick={() => setSelectedReviewForModal(testimonial)}
                              className="text-xs text-gold-accent font-medium hover:underline mb-4 block"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              Read more
                            </button>
                          )}
                        </div>

                        {/* Divider & Reviewer Profile */}
                        <div className="pt-4 border-t border-teal-accent/15 flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-3">
                            {testimonial.image ? (
                              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-gold-accent/50 flex-shrink-0">
                                <img
                                  src={testimonial.image}
                                  alt={testimonial.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <MonogramAvatar name={testimonial.name} />
                            )}
                            <div>
                              <h3
                                className="text-cream font-semibold text-sm sm:text-base"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                              >
                                {testimonial.name}
                              </h3>
                              <p
                                className="text-xs text-gold-accent/90 font-medium"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                              >
                                {testimonial.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Single Centered Button After Feedback / Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-14 text-center flex flex-col items-center justify-center gap-3"
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-accent to-gold-accent text-primary-dark font-semibold text-base rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(3,101,100,0.5)] focus:outline-none"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <PlusCircle className="w-5 h-5" />
                <span>Share Your Experience</span>
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewAdded={handleReviewAdded}
      />

      {/* Read More Detail Modal */}
      {selectedReviewForModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          onClick={() => setSelectedReviewForModal(null)}
        >
          <div
            className="relative w-full max-w-lg bg-secondary-dark border border-teal-accent/30 rounded-2xl p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedReviewForModal(null)}
              className="absolute top-4 right-4 text-cream/60 hover:text-gold-accent"
              aria-label="Close review detail"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex gap-1 mb-4">
              {[...Array(selectedReviewForModal.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold-accent text-gold-accent" />
              ))}
            </div>
            <p className="text-cream/90 leading-relaxed text-base italic mb-6">
              "{selectedReviewForModal.review}"
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-teal-accent/20">
              {selectedReviewForModal.image ? (
                <img
                  src={selectedReviewForModal.image}
                  alt={selectedReviewForModal.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gold-accent/50"
                />
              ) : (
                <MonogramAvatar name={selectedReviewForModal.name} />
              )}
              <div>
                <h4 className="text-cream font-semibold">{selectedReviewForModal.name}</h4>
                <p className="text-xs text-gold-accent">{selectedReviewForModal.role}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
