import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { ServicesSection } from "./components/ServicesSection";
import { PortfolioSection } from "./components/PortfolioSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { InstagramSection } from "./components/InstagramSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import portraitImg from "./Assets/Shubham Solanki.webp";
import review1 from "./Assets/Review/1.webp";
import review2 from "./Assets/Review/2.webp";
import review3 from "./Assets/Review/3.webp";
import { portfolioVideos } from "./data/portfolioData";
import { instagramMedia } from "./data/instagramData";

const testimonials = [
  {
    id: 1,
    name: "Hasti Vora",
    role: "Podcaster",
    image: review1,
    review:
      "The podcast video quality is incredible! Professional editing, perfect lighting, and the final reels helped grow our audience significantly. Highly recommend for any content creator.",
    rating: 5,
  },
  {
    id: 2,
    name: "Yagnadeepsinh Sarvaiya",
    role: "Entrepreneur",
    image: review2,
    review:
      "The quality and creativity exceeded all expectations. This videographer truly understands luxury branding and storytelling.",
    rating: 5,
  },
  {
    id: 3,
    name: "Delight Photography",
    role: "Studio & Photographer",
    image: review3,
    review:
      "Outstanding collaboration! The video editing and color grading perfectly complemented our photography. The final product was breathtaking and our clients loved it. A true professional who understands visual storytelling.",
    rating: 5,
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Global styles */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        body {
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
        }
      `}</style>

      <Navbar />
      <main>
        <HeroSection />
        <AboutSection portraitUrl={portraitImg} />
        <ServicesSection />
        <PortfolioSection videos={portfolioVideos} />
        <TestimonialsSection />
        <InstagramSection reels={instagramMedia} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

