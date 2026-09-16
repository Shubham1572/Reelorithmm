import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Play, ExternalLink } from "lucide-react";
import Masonry from "react-responsive-masonry";
import { VideoModal } from "./VideoModal";
import type { PortfolioVideo } from "../types/media";
import {
  portfolioCategories,
  portfolioCategoryLinks,
} from "../data/portfolioData";

interface PortfolioSectionProps {
  videos: PortfolioVideo[];
}

function MediaPreview({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        className={`${className} bg-gradient-to-br from-primary-dark via-secondary-dark to-primary-dark flex items-center justify-center`}
        role="img"
        aria-label={alt}
      >
        <div className="w-full h-full bg-teal-accent/10 backdrop-blur-xs" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

export function PortfolioSection({ videos }: PortfolioSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState<PortfolioVideo | null>(null);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setColumns(1);
      } else if (window.innerWidth < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredVideos =
    selectedCategory === "All"
      ? videos
      : videos.filter((video) => video.category === selectedCategory);

  const seeMoreConfig = portfolioCategoryLinks[selectedCategory];

  return (
    <section id="portfolio" ref={ref} className="relative bg-secondary-dark py-24 px-6 overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-teal-accent/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2
            className="text-5xl md:text-6xl text-cream mb-4 font-semibold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            My Cinematic{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-accent to-cream">
              Work
            </span>
          </h2>
          <p
            className="text-xl text-cream/80 italic"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Don't just watch — feel the story.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3.5 mb-14"
          role="tablist"
          aria-label="Portfolio categories"
        >
          {portfolioCategories.map((category) => (
            <button
              key={category}
              role="tab"
              aria-selected={selectedCategory === category}
              onClick={() => {
                setSelectedCategory(category);
                setSelectedVideo(null);
              }}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-teal-accent to-gold-accent text-primary-dark shadow-[0_0_20px_rgba(3,101,100,0.4)] scale-105"
                  : "bg-primary-dark text-cream/70 hover:text-cream border border-teal-accent/20 hover:border-gold-accent/50"
              }`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Video Grid - Masonry Layout with Compact Portrait Cards (aspect-[4/5]) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {filteredVideos.length === 0 && (
            <p
              className="text-center text-cream/60 py-12 text-base"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              No work in this category yet. Browse the full collection below.
            </p>
          )}

          {(filteredVideos.length > 0 || seeMoreConfig) && (
            <Masonry columnsCount={columns} gutter="1.5rem">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedVideo(video);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open project ${video.title}`}
                >
                  {/* Short Portrait Video Card (aspect-[4/5]) */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-primary-dark border border-teal-accent/25 transition-all duration-500 hover:border-gold-accent/60 hover:shadow-[0_0_30px_rgba(205,179,128,0.2)] hover:-translate-y-1.5">
                    {/* Category Badge overlay */}
                    <div className="absolute top-4 left-4 z-20 pointer-events-none">
                      <span
                        className="px-3 py-1 bg-primary-dark/80 backdrop-blur-md border border-teal-accent/30 rounded-full text-gold-accent text-xs font-medium tracking-wide"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {video.category}
                      </span>
                    </div>

                    {/* Media Poster Layer */}
                    <MediaPreview
                      src={video.poster || video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/30 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Play/View Indicator Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-all duration-500">
                      <div className="w-14 h-14 rounded-full bg-teal-accent/30 backdrop-blur-md border-2 border-gold-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(205,179,128,0.4)]">
                        <Play className="w-7 h-7 text-gold-accent ml-0.5" fill="currentColor" />
                      </div>
                    </div>

                    {/* Text Title & Short Description */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500 z-10">
                      <h3
                        className="text-xl sm:text-2xl text-cream font-semibold mb-1"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {video.title}
                      </h3>
                      <p
                        className="text-xs sm:text-sm text-cream/80 line-clamp-2 font-light"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {video.description}
                      </p>
                    </div>

                    {/* Hover Glow Accent */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-teal-accent to-gold-accent rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10 pointer-events-none" />
                  </div>
                </motion.div>
              ))}

              {/* See More Drive Link Card */}
              {seeMoreConfig && (
                <motion.a
                  href={seeMoreConfig.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: filteredVideos.length * 0.08 }}
                  className="group relative block cursor-pointer focus:outline-none rounded-2xl"
                  aria-label={`See more ${selectedCategory === "All" ? "portfolio" : selectedCategory} work on Google Drive`}
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-primary-dark border border-teal-accent/25 transition-all duration-500 hover:border-gold-accent/60 hover:shadow-[0_0_30px_rgba(205,179,128,0.2)] hover:-translate-y-1.5">
                    <MediaPreview
                      src={seeMoreConfig.poster || seeMoreConfig.preview}
                      alt={seeMoreConfig.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/70 to-primary-dark/40 opacity-85 group-hover:opacity-95 transition-opacity duration-500" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 p-6 text-center z-10">
                      <div className="flex items-center gap-2 px-4 py-2 bg-teal-accent/30 backdrop-blur-md border border-teal-accent/50 rounded-full transform scale-95 group-hover:scale-100 transition-transform duration-300 shadow-md">
                        <ExternalLink className="w-4 h-4 text-gold-accent" />
                        <span
                          className="text-gold-accent text-xs font-semibold tracking-wide"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          See More
                        </span>
                      </div>
                      <div>
                        <h3
                          className="text-xl text-cream font-semibold mb-1"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {seeMoreConfig.title}
                        </h3>
                        <p
                          className="text-cream/70 text-xs max-w-xs mx-auto leading-relaxed"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {seeMoreConfig.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.a>
              )}
            </Masonry>
          )}
        </motion.div>
      </div>

      {/* Single Project Detail Modal */}
      <VideoModal
        isOpen={selectedVideo !== null}
        onClose={() => setSelectedVideo(null)}
        video={selectedVideo}
      />
    </section>
  );
}
