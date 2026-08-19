import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  review: string;
  rating: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative bg-primary-dark py-24 px-6">
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-teal-accent/10 rounded-full blur-[150px]" />

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
            Client{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-accent to-cream">
              Stories
            </span>
          </h2>
          <p
            className="text-xl text-cream/80"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            What people say about working with me
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative h-full"
            >
              {/* Glass card */}
              <div className="relative h-full p-8 bg-secondary-dark/30 backdrop-blur-md border border-teal-accent/25 rounded-2xl overflow-hidden transition-all duration-500 hover:border-gold-accent/50 hover:shadow-[0_0_30px_rgba(205,179,128,0.15)] flex flex-col">
                {/* Glassmorphism effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-accent/5 via-transparent to-gold-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-gold-accent text-gold-accent" />
                    ))}
                  </div>

                  {/* Review - flex-grow to push client info to bottom */}
                  <p
                    className="text-cream/90 leading-relaxed mb-6 italic flex-grow"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    "{testimonial.review}"
                  </p>

                  {/* Client info - always at bottom */}
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-accent/50 flex-shrink-0">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4
                        className="text-cream"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {testimonial.name}
                      </h4>
                      <p
                        className="text-sm text-gold-accent/70"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
