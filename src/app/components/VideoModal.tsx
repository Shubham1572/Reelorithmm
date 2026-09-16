import { motion, AnimatePresence } from "motion/react";
import { X, Play } from "lucide-react";
import { useEffect, useCallback } from "react";
import type { PortfolioVideo } from "../types/media";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: PortfolioVideo | null;
}

export function VideoModal({ isOpen, onClose, video }: VideoModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const isPlayableVideo =
    video?.videoUrl &&
    (video.videoUrl.toLowerCase().endsWith(".mp4") ||
      video.videoUrl.toLowerCase().includes(".mp4?") ||
      video.videoUrl.toLowerCase().endsWith(".mov") ||
      video.videoUrl.toLowerCase().includes(".mov?") ||
      video.videoUrl.includes("/assets/"));

  return (
    <AnimatePresence>
      {isOpen && video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/90 backdrop-blur-md p-4 overflow-hidden"
          onClick={onClose}
        >
          {/* SINGLE-VIEW DARK NAVY BLUE FRAME — NO SCROLLBAR */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl bg-secondary-dark/95 border border-teal-accent/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-xl p-5 sm:p-7 flex flex-col justify-between max-h-[90vh] overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button at Top Right */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-cream/70 hover:text-gold-accent transition-colors duration-300 focus:outline-none z-30 p-1"
              aria-label="Close project modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* 1. TOP: Category Badge & Project Title */}
            <div className="mb-3 pr-8 flex-shrink-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="px-2.5 py-0.5 bg-teal-accent/20 border border-teal-accent/30 rounded-full text-gold-accent text-[11px] font-medium tracking-wide uppercase"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {video.category}
                </span>
              </div>
              <h3
                className="text-xl sm:text-2xl md:text-3xl text-cream font-semibold tracking-tight leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {video.title}
              </h3>
            </div>

            {/* 2. MIDDLE: Video Player Container */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-primary-dark border border-teal-accent/20 shadow-inner mb-4 flex items-center justify-center flex-1 min-h-0">
              {isPlayableVideo ? (
                <video
                  src={video.videoUrl}
                  poster={video.poster || video.thumbnail}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={video.poster || video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
                    <div className="w-14 h-14 rounded-full bg-teal-accent/30 backdrop-blur-md border-2 border-gold-accent flex items-center justify-center shadow-lg">
                      <Play className="w-7 h-7 text-gold-accent ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. BOTTOM: Project Description */}
            <div className="pt-3 border-t border-teal-accent/20 flex-shrink-0 flex items-center justify-between gap-4">
              <div>
                <p
                  className="text-cream/90 text-xs sm:text-sm leading-relaxed max-w-xl font-light line-clamp-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {video.description}
                </p>
              </div>
              <span
                className="px-3 py-1 bg-primary-dark/60 border border-teal-accent/20 rounded-lg text-gold-accent text-xs font-medium flex-shrink-0"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Cinematic Work
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
