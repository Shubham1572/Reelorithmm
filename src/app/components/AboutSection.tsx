import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

interface AboutSectionProps {
  portraitUrl: string;
}

export function AboutSection({ portraitUrl }: AboutSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="about" ref={ref} className="relative bg-secondary-dark py-24 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-accent/15 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-5xl md:text-6xl text-cream mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Reelorithmm<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-accent to-cream">
                Creating Visual
              </span>
              <br />
              Magic
            </h2><br />
            <p
              className="text-lg text-cream/80 leading-relaxed mb-6"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-accent to-cream text-3xl">
                Founder : Shubham Solanki
              </span><br></br>
              I'm a cinematic videographer specializing in creating visually stunning reels
              and storytelling-driven videos. Every frame is crafted to feel premium and
              unforgettable.
            </p>
            <p
              className="text-lg text-cream/60 leading-relaxed"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              With years of experience in capturing weddings, car shoots, brand promotions,
              and social media content, I bring a unique blend of technical expertise and
              artistic vision to every project.
            </p>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full rounded-2xl overflow-hidden group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-accent to-gold-accent rounded-2xl opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-500" />

              {/* Image container */}
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={portraitUrl}
                  alt="Professional Videographer"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 via-transparent to-transparent" />
              </div>
            </div>

            {/* Decorative elements */}
            <motion.div
              className="absolute -top-6 -left-6 w-32 h-32 border-2 border-gold-accent/30 rounded-2xl"
              animate={{
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
