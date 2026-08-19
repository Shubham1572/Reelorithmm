import { motion, AnimatePresence } from "motion/react";
import { X, Play } from "lucide-react";
import { useEffect } from "react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  description: string;
}

export function VideoModal({ isOpen, onClose, videoUrl, title, description }: VideoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-white hover:text-amber-500 transition-colors duration-300"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Video container */}
            <div className="relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
              {videoUrl.includes('.mp4') ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <>
                  {/* Placeholder video - Shows thumbnail with play icon */}
                  <img
                    src={videoUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 rounded-full bg-amber-500/20 backdrop-blur-sm border-2 border-amber-500 flex items-center justify-center">
                      <Play className="w-10 h-10 text-amber-500 ml-1" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Info */}
            <div className="mt-6 text-center">
              <h3
                className="text-3xl text-white mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {title}
              </h3>
              <p
                className="text-zinc-400"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
