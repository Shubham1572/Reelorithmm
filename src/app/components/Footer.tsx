import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { CONTACT, getWhatsAppUrl } from "../config/contact";
import logoSvg from "../Assets/Logo/Logo.svg";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-secondary-dark border-t border-teal-accent/20">
      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Logo & Studio Description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logoSvg} alt="Reelorithmm Logo" className="w-8 h-8" />
              <h3
                className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-gold-accent to-cream font-semibold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Reelorithmm
              </h3>
            </div>
            <p
              className="text-cream/70 text-sm leading-relaxed mb-4"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Cinematic visual storytelling studio founded by Shubham Solanki. Capturing emotions, weddings, automobile films, and brand narratives with timeless direction.
            </p>
            <p
              className="text-xs text-gold-accent font-medium"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Based in Bhavnagar, Gujarat, India
            </p>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4
              className="text-cream font-semibold mb-4 text-lg"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Services
            </h4>
            <ul className="space-y-2.5 text-sm text-cream/70" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <li>
                <a href="#services" className="hover:text-gold-accent transition-colors">
                  Wedding Cinematic Reels
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-gold-accent transition-colors">
                  Engagement Shoots
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-gold-accent transition-colors">
                  Car Cinematic Shoots
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-gold-accent transition-colors">
                  Hotel & Brand Promotions
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-gold-accent transition-colors">
                  Social Media Reels
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-gold-accent transition-colors">
                  Podcast Highlights
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div>
            <h4
              className="text-cream font-semibold mb-4 text-lg"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-cream/70" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <li>
                <a href="#about" className="hover:text-gold-accent transition-colors">
                  About Shubham Solanki
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-gold-accent transition-colors">
                  Service Offerings
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-gold-accent transition-colors">
                  Portfolio / Work
                </a>
              </li>
              <li>
                <a href="#instagram" className="hover:text-gold-accent transition-colors">
                  Latest Instagram Reels
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-gold-accent transition-colors">
                  Contact Studio
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: More / Contact */}
          <div>
            <h4
              className="text-cream font-semibold mb-4 text-lg"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              More / Contact
            </h4>
            <ul className="space-y-3 text-sm text-cream/80" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <li>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  <span>WhatsApp Direct Chat</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-gold-accent transition-colors">
                  <Mail className="w-4 h-4 text-gold-accent" />
                  <span>{CONTACT.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 hover:text-gold-accent transition-colors">
                  <Phone className="w-4 h-4 text-gold-accent" />
                  <span>{CONTACT.phone}</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-accent flex-shrink-0" />
                <span>{CONTACT.location}</span>
              </li>
              <li>
                <a
                  href={CONTACT.instagram.main}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gold-accent hover:underline font-medium"
                >
                  <Instagram className="w-4 h-4" />
                  <span>{CONTACT.instagram.handle}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar — full width */}
      <div className="w-full bg-primary-dark py-6 border-t border-teal-accent/15 text-center">
        <p
          className="text-cream/50 text-sm"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          © {currentYear} Reelorithmm. All rights reserved. Crafted with passion.
        </p>
      </div>
    </footer>
  );
}
