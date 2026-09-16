import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { MapPin, Film, Sparkles, Calendar } from "lucide-react";

interface AboutSectionProps {
  portraitUrl: string;
}

export function AboutSection({ portraitUrl }: AboutSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const infoCards = [
    {
      icon: MapPin,
      label: "Location",
      value: "Bhavnagar, Gujarat, India",
    },
    {
      icon: Film,
      label: "Working With",
      value: "Brands, Weddings, Automotive, Events",
    },
    {
      icon: Calendar,
      label: "Availability",
      value: "Project Based / By Appointment",
    },
  ];

  return (
    <section id="about" ref={ref} className="relative bg-secondary-dark py-24 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-accent/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          {/* LEFT Column: Content, Top Specialization Chip, Improved Description & 3 Horizontal Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="md:col-span-7 flex flex-col justify-center order-1"
          >
            {/* Top Specialization Chip / Label */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-accent/20 backdrop-blur-md border border-gold-accent/40 rounded-full mb-6 w-max max-w-full">
              <Sparkles className="w-4 h-4 text-gold-accent flex-shrink-0" />
              <span
                className="text-gold-accent text-xs md:text-sm font-semibold tracking-wider uppercase whitespace-nowrap overflow-hidden text-ellipsis"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Cinematic stories crafted with emotion and purpose.
              </span>
            </div>

            {/* Main Heading */}
            <h2
              className="text-4xl md:text-5xl lg:text-6xl text-cream mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Reelorithmm
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-accent via-cream to-gold-accent">
                Capturing Visual Magic
              </span>
            </h2>

            {/* Improved Impactful Top Specialization Description */}
            <p
              className="text-lg md:text-xl text-cream/95 font-medium leading-relaxed mb-4"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Cinematic visual storytelling crafted with emotion, precision, and purpose — from weddings and automotive films to brands, events, and social content.
            </p>

            <p
              className="text-base text-cream/70 leading-relaxed mb-8"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Based in <strong className="text-gold-accent font-semibold">Bhavnagar, Gujarat, India</strong>, Reelorithmm is led by founder and director Shubham Solanki, delivering high-end visual direction, color grading, and emotion-driven filmmaking for every project.
            </p>

            {/* Bottom 3 Information Cards — ONE HORIZONTAL ROW on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {infoCards.map((card) => (
                <div
                  key={card.label}
                  className="p-4 bg-primary-dark/60 backdrop-blur-sm border border-teal-accent/25 rounded-xl hover:border-gold-accent/40 transition-colors duration-300 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <card.icon className="w-4 h-4 text-gold-accent flex-shrink-0" />
                    <span
                      className="text-[10px] uppercase tracking-wider text-cream/60 font-semibold"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {card.label}
                    </span>
                  </div>
                  <p
                    className="text-gold-accent text-xs md:text-sm font-bold leading-snug"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT Column: Profile Photo Card (5 cols on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-5 flex flex-col items-center justify-center text-center order-2"
          >
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden group shadow-2xl">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-accent to-gold-accent rounded-2xl opacity-40 blur-xl group-hover:opacity-75 transition-opacity duration-500" />

              {/* Photo container */}
              <div className="relative rounded-2xl overflow-hidden bg-primary-dark aspect-[4/5]">
                <img
                  src={portraitUrl}
                  alt="Shubham Solanki - Cinematographer & Director"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/20 to-transparent" />

                {/* Name plate overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-center z-10 bg-primary-dark/85 backdrop-blur-sm border-t border-teal-accent/20">
                  <h3
                    className="text-2xl text-cream font-semibold tracking-wide"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Shubham Solanki
                  </h3>
                  <p
                    className="text-xs text-gold-accent font-semibold mt-1 tracking-wider uppercase"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Cinematographer & Director
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
