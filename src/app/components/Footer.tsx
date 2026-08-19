import { Instagram, Youtube, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-secondary-dark border-t border-secondary-dark">
      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Description */}
          <div>
            <h3
              className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-gold-accent to-cream mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Reelorithmm
            </h3>
            <p
              className="text-cream/50 text-sm leading-relaxed"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Creating premium videography that captures emotions and tells unforgettable
              stories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-cream mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
               <li>
                <a
                  href="#about"
                  className="text-cream/60 hover:text-gold-accent transition-colors duration-300"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-cream/60 hover:text-gold-accent transition-colors duration-300"
                >
                  Services
                </a>
                </li>
              <li>
                <a
                  href="#portfolio"
                  className="text-cream/60 hover:text-gold-accent transition-colors duration-300"
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  href="#instagram"
                  className="text-cream/60 hover:text-gold-accent transition-colors duration-300"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-cream/60 hover:text-gold-accent transition-colors duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4
              className="text-cream mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Connect
            </h4>
            <div className="space-y-3 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <p className="text-cream/60 text-sm flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +91 7567745309
              </p>
              <p className="text-cream/60 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" />
                solankishubham966@gmail.com
              </p>
            </div>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/reelorithmm/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary-dark border border-teal-accent/20 flex items-center justify-center text-cream/60 hover:text-gold-accent hover:border-gold-accent transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
               <a
                  href="https://www.instagram.com/clipsbyshubhamm/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-secondary-dark border border-teal-accent/20 flex items-center justify-center text-cream/60 hover:text-gold-accent hover:border-gold-accent transition-colors duration-300"
              >
                  <Instagram className="w-5 h-5" />
                </a>
              <a
                href="https://www.instagram.com/_.shubhamm.__15/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary-dark border border-teal-accent/20 flex items-center justify-center text-cream/60 hover:text-gold-accent hover:border-gold-accent transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
             
            </div>
          </div>
        </div>

      </div>

      {/* Bottom bar — full width */}
      <div className="w-full bg-primary-dark py-8 border-t border-secondary-dark text-center">
        <p
          className="text-cream/40 text-md"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          © 2026 Reelorithmm. All rights reserved. Crafted with passion.
        </p>
      </div>
    </footer>
  );
}
