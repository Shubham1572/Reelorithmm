import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { services } from "../data/servicesData";

function ServiceBackground({
  background,
  backgroundType,
  backgroundAlt,
  poster,
}: {
  background: string;
  backgroundType: "image" | "video";
  backgroundAlt: string;
  poster?: string;
}) {
  if (backgroundType === "video" || background.includes(".mp4")) {
    return (
      <video
        src={background}
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={backgroundAlt}
      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
      style={{ backgroundImage: `url(${background})` }}
    />
  );
}

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative bg-primary-dark py-24 px-6" id="services">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-teal-accent/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold-accent/10 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            className="text-5xl md:text-6xl text-cream mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            What I{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-accent to-cream">
              Create
            </span>
          </h2>
          <p
            className="text-xl text-cream/80"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Premium videography services tailored to your vision
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative h-full"
            >
              {/* Card */}
              <div className="relative h-full min-h-[280px] p-8 border border-teal-accent/20 rounded-2xl overflow-hidden transition-all duration-500 hover:border-gold-accent/50 hover:shadow-[0_0_40px_rgba(205,179,128,0.15)] flex flex-col">
                {/* Background media */}
                <ServiceBackground
                  background={service.background}
                  backgroundType={service.backgroundType}
                  backgroundAlt={service.backgroundAlt}
                  poster={service.poster}
                />

                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-primary-dark/75 group-hover:bg-primary-dark/65 transition-colors duration-500" />

                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-accent/10 via-transparent to-gold-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-teal-accent/30 to-gold-accent/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                    <service.icon className="w-8 h-8 text-gold-accent" />
                  </div>

                  {/* Text */}
                  <h3
                    className="text-2xl text-cream mb-3 group-hover:text-gold-accent transition-colors duration-300"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-cream/90 leading-relaxed flex-grow"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
