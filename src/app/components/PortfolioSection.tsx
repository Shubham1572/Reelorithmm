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

function isDirectVideoUrl(url: string | undefined): boolean {
  if (!url) return false;
  if (url.includes("drive.google.com") || url.includes("google.com/drive")) {
    return false;
  }
  return (
    url.toLowerCase().endsWith(".mp4") ||
    url.toLowerCase().endsWith(".webm") ||
    url.toLowerCase().endsWith(".ogg") ||
    url.toLowerCase().includes(".mp4?") ||
    url.includes("/assets/") ||
    url.startsWith("blob:") ||
    url.startsWith("data:video/") ||
    url.toLowerCase().includes(".mp4")
  );
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

  const isGoogleDriveWebpage =
    Boolean(src) && (src.includes("drive.google.com") || src.includes("google.com/drive"));

  const isVideo = !isGoogleDriveWebpage && isDirectVideoUrl(src);

  if (hasError || isGoogleDriveWebpage) {
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

  if (isVideo) {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        onError={() => setHasError(true)}
        aria-label={alt}
        className={className}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

export function PortfolioSection({ videos }: PortfolioSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
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
    <section id="portfolio" ref={ref} className="relative bg-secondary-dark py-24 px-6">
      {/* Background glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-teal-accent/15 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2
            className="text-5xl md:text-6xl text-cream mb-4"
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

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
          role="tablist"
          aria-label="Portfolio categories"
        >
          {portfolioCategories.map((category) => (
            <button
              key={category}
              role="tab"
              aria-selected={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-dark ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-teal-accent to-gold-accent text-primary-dark shadow-[0_0_20px_rgba(3,101,100,0.4)]"
                  : "bg-primary-dark text-cream/70 hover:text-cream border border-teal-accent/20 hover:border-gold-accent/50"
              }`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Video Grid - Masonry Layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {filteredVideos.length === 0 && (
            <p
              className="text-center text-cream/60 py-8"
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
                  transition={{ duration: 0.5, delay: index * 0.1 }}
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
                  aria-label={`Play ${video.title}`}
                >
                  {/* Video card */}
                  <div className="relative rounded-2xl overflow-hidden">
                    <MediaPreview
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 min-h-[300px]"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Play icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="w-16 h-16 rounded-full bg-teal-accent/20 backdrop-blur-sm border-2 border-teal-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-8 h-8 text-gold-accent ml-1" />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <p
                        className="text-sm text-gold-accent mb-1"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {video.category}
                      </p>
                      <h3
                        className="text-xl text-cream"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {video.title}
                      </h3>
                    </div>

                    {/* Glow effect on hover */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-teal-accent to-gold-accent rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />
                  </div>
                </motion.div>
              ))}

              {/* See More card — matched 100% with portfolio cards */}
              {seeMoreConfig && (
                <motion.a
                  href={seeMoreConfig.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: filteredVideos.length * 0.1 }}
                  className="group relative block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-dark rounded-2xl"
                  aria-label={`See more ${selectedCategory === "All" ? "portfolio" : selectedCategory} work on Google Drive`}
                >
                  <div className="relative rounded-2xl overflow-hidden">
                    {/* Media in natural flow - matches first card dimensions exactly */}
                    <MediaPreview
                      src={seeMoreConfig.preview}
                      alt={seeMoreConfig.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 min-h-[300px]"
                    />

                    {/* Dark / Semi-transparent Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/70 to-primary-dark/40 opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Content (Text + Buttons) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center z-10">
                      <div className="flex items-center gap-2 px-5 py-2.5 bg-teal-accent/20 backdrop-blur-md border border-teal-accent/50 rounded-full transform scale-95 group-hover:scale-100 transition-transform duration-500 shadow-lg">
                        <ExternalLink className="w-4 h-4 text-gold-accent" />
                        <span
                          className="text-gold-accent text-sm font-medium tracking-wide"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          See More
                        </span>
                      </div>
                      <div className="text-center">
                        <p
                          className="text-sm text-gold-accent mb-1 font-medium"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {selectedCategory === "All" ? "Full Portfolio" : selectedCategory}
                        </p>
                        <h3
                          className="text-xl text-cream"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {seeMoreConfig.title}
                        </h3>
                        <p
                          className="text-cream/70 text-sm mt-2 max-w-xs mx-auto leading-relaxed"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {seeMoreConfig.description}
                        </p>
                      </div>
                    </div>

                    {/* Glow effect on hover */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-teal-accent to-gold-accent rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />
                  </div>
                </motion.a>
              )}
            </Masonry>
          )}
        </motion.div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.thumbnail}
          title={selectedVideo.title}
          description={selectedVideo.description}
        />
      )}
    </section>
  );
}
