import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Instagram, Play, ExternalLink } from "lucide-react";
import type { InstagramMediaItem, InstagramMediaType } from "../types/media";
import { instagramProfileUrl } from "../data/instagramData";

interface InstagramSectionProps {
  reels: InstagramMediaItem[];
}

function MediaFallback({ type }: { type: InstagramMediaType }) {
  return (
    <div
      className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-3 bg-primary-dark px-4"
      aria-hidden="true"
    >
      <div className="w-14 h-14 rounded-full bg-teal-accent/20 border border-teal-accent/40 flex items-center justify-center">
        {type === "video" ? (
          <Play
            className="w-7 h-7 text-gold-accent ml-0.5"
            fill="currentColor"
          />
        ) : (
          <span
            className="text-xs font-semibold text-gold-accent"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            GIF
          </span>
        )}
      </div>
      <p
        className="text-cream/50 text-xs text-center leading-snug"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Preview unavailable
        <br />
        <span className="text-gold-accent/80">Tap to view on Instagram</span>
      </p>
    </div>
  );
}

function InstagramMediaPreview({ item }: { item: InstagramMediaItem }) {
  const alt = item.alt ?? item.title;
  const [hasError, setHasError] = useState(false);
  const mediaSrc = item.poster || item.mediaUrl;

  useEffect(() => {
    setHasError(false);
  }, [mediaSrc]);

  if (hasError) {
    return <MediaFallback type={item.type} />;
  }

  return (
    <img
      src={mediaSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setHasError(true)}
      className="absolute inset-0 z-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
    />
  );
}

function MediaTypeBadge({ type }: { type: InstagramMediaType }) {
  if (type === "video") {
    return (
      <div className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-primary-dark/60 backdrop-blur-sm flex items-center justify-center pointer-events-none">
        <Play
          className="w-4 h-4 text-gold-accent"
          fill="currentColor"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <span
      className="absolute top-4 left-4 z-20 px-2 py-0.5 text-xs font-medium text-gold-accent bg-primary-dark/60 backdrop-blur-sm rounded-full pointer-events-none"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      GIF
    </span>
  );
}

export function InstagramSection({ reels }: InstagramSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      id="instagram"
      ref={ref}
      className="relative bg-secondary-dark py-24 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Instagram className="w-10 h-10 text-gold-accent" />
            <h2
              className="text-5xl md:text-6xl text-cream"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Latest{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-accent to-cream">
                Reels
              </span>
            </h2>
          </div>
          <p
            className="text-xl text-cream/80"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Follow me on Instagram for daily content
          </p>
        </motion.div>

        {/* Horizontal scroll */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
            {reels.map((reel, index) => (
              <motion.a
                key={reel.id}
                href={reel.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex-shrink-0 w-[280px] cursor-pointer block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-dark rounded-2xl"
                aria-label={`View ${reel.title} on Instagram`}
              >
                {/* Reel card - Instagram style */}
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-primary-dark">
                  {/* Media layer */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <InstagramMediaPreview item={reel} />
                  </div>

                  <MediaTypeBadge type={reel.type} />

                  {/* Dark overlay - does not block clicks (parent <a> handles navigation) */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary-dark/80 via-primary-dark/20 to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-teal-accent/20 backdrop-blur-sm border border-teal-accent/50 rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-500">
                      <Play
                        className="w-4 h-4 text-gold-accent"
                        fill="currentColor"
                      />
                      <span
                        className="text-gold-accent text-sm font-medium tracking-wide"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {reel.type === "gif"
                          ? "View on Instagram"
                          : "Watch Reel"}
                      </span>
                    </div>
                  </div>

                  {/* Instagram icon - top right */}
                  <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-teal-accent/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <ExternalLink className="w-5 h-5 text-gold-accent" />
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500 pointer-events-none">
                    <p
                      className="text-cream text-sm font-medium"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {reel.title}
                    </p>
                  </div>

                  {/* Glow on hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-teal-accent to-gold-accent rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10 pointer-events-none" />
                </div>
              </motion.a>
            ))}
          </div>

          {/* Gradient fade on edges */}
          <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-secondary-dark to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-secondary-dark to-transparent pointer-events-none" />
        </motion.div>

        {/* Follow button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-accent to-gold-accent text-primary-dark font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(3,101,100,0.5)] focus:outline-none"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <Instagram className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span>Follow @reelorithmm</span>
          </a>
        </motion.div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
