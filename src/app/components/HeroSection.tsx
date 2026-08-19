import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  // Base cubic-bezier curve for smooth, luxury ease-out
  const easeCurve = [0.25, 0.1, 0.25, 1.0];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-primary-dark">
      {/* Background Effect - Simulated gradient animation */}
      <div className="absolute inset-0 bg-primary-dark pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-secondary-dark/60 to-primary-dark opacity-95" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-teal-accent/15 via-transparent to-gold-accent/15"
          animate={shouldReduceMotion ? { opacity: 0.4 } : { opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Subtle Ambient Golden Radial Light behind main heading */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-teal-accent/10 via-gold-accent/20 to-teal-accent/10 rounded-full blur-[120px] pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.6, 0.4], scale: [0.8, 1.1, 1] }}
          transition={{
            duration: 3,
            delay: 1.0,
            ease: "easeOut",
          }}
        />
        {/* Cinematic grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="max-w-5xl">
          {/* Main Title Heading */}
          <h1
            className="mb-6 text-6xl md:text-7xl lg:text-8xl text-cream leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {/* Step 1: Reelorithmm (0.2s - 0.8s) */}
            <motion.span
              className="block"
              initial={
                shouldReduceMotion
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 25, filter: "blur(8px)" }
              }
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: easeCurve,
              }}
            >
              Reelorithmm
            </motion.span>

            {/* Step 2: That Feel Real - Main Reveal (0.7s - 1.5s) */}
            <motion.span
              className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-gold-accent via-cream to-gold-accent"
              initial={
                shouldReduceMotion
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 35, filter: "blur(10px)" }
              }
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.9,
                delay: 0.7,
                ease: easeCurve,
              }}
            >
              That Feel Real
              {/* Subtle shimmer sweep line behind title text */}
              {!shouldReduceMotion && (
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-accent/30 to-transparent bg-clip-text pointer-events-none"
                  initial={{ opacity: 0, x: "-100%" }}
                  animate={{ opacity: [0, 0.8, 0], x: ["-100%", "100%"] }}
                  transition={{
                    duration: 1.8,
                    delay: 1.2,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.span>
          </h1>

          {/* Step 3: Categories Subtitle (1.4s - 2.0s) */}
          <motion.p
            className="mb-4 text-xl md:text-2xl text-cream/85"
            style={{ fontFamily: "'Poppins', sans-serif" }}
            initial={
              shouldReduceMotion
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 20, filter: "blur(4px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.7,
              delay: 1.4,
              ease: easeCurve,
            }}
          >
            Reels | Weddings | Car Shoots | Brand Promotions
          </motion.p>

          {/* Step 4: Tagline (1.8s - 2.5s) */}
          <motion.p
            className="mb-12 text-lg md:text-xl text-cream/60 italic"
            style={{ fontFamily: "'Poppins', sans-serif" }}
            initial={
              shouldReduceMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 15 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 1.8,
              ease: easeCurve,
            }}
          >
            We don't just shoot videos — we capture emotions.
          </motion.p>

          {/* Step 5: Action Buttons (2.2s - 3.0s) */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={
              shouldReduceMotion
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 15, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 2.2,
              ease: easeCurve,
            }}
          >
            <a
              href="#portfolio"
              className="group relative px-8 py-4 bg-gradient-to-r from-teal-accent to-gold-accent text-primary-dark overflow-hidden rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(3,101,100,0.5)]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span className="relative z-10 font-medium">View My Work</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold-accent to-teal-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <a
              href="#contact"
              className="px-8 py-4 border-2 border-gold-accent text-gold-accent rounded-full font-medium transition-all duration-300 hover:bg-gold-accent/10 hover:shadow-[0_0_20px_rgba(205,179,128,0.3)]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Contact Me
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToNext}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-gold-accent cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            y: [0, 10, 0],
          }}
          transition={{
            opacity: { duration: 0.8, delay: 2.6 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          aria-label="Scroll to next section"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.button>
      </div>
    </section>
  );
}
