import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { getWhatsAppUrl } from "../config/contact";
import logoSvg from "../Assets/Logo/Logo.svg";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Reels", href: "#instagram" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-primary-dark/85 backdrop-blur-md border-b border-teal-accent/20 py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-12 items-center justify-between">
        {/* Brand Logo (Left 3 cols on desktop) */}
        <div className="md:col-span-3 flex items-center justify-start">
          <a
            href="#"
            className="flex items-center gap-3 text-2xl md:text-3xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-gold-accent via-cream to-gold-accent font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent rounded-lg"
            style={{ fontFamily: "'Playfair Display', serif" }}
            aria-label="Reelorithmm Homepage"
          >
            <img src={logoSvg} alt="Reelorithmm Logo" className="w-8 h-8 inline-block" />
            <span>Reelorithmm</span>
          </a>
        </div>

        {/* Horizontally Centered Desktop Links (Middle 6 cols on desktop) */}
        <nav className="hidden md:flex md:col-span-6 items-center justify-center gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-cream/80 hover:text-gold-accent text-sm font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent rounded"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Action Area (Right 3 cols on desktop) */}
        <div className="hidden md:flex md:col-span-3 items-center justify-end">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-accent to-gold-accent text-primary-dark font-semibold text-sm rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(3,101,100,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent"
            style={{ fontFamily: "'Poppins', sans-serif" }}
            aria-label="Contact Shubham Solanki on WhatsApp"
          >
            <FaWhatsapp className="w-4 h-4" />
            <span>Let's Talk</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center justify-end">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-cream/90 hover:text-gold-accent transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent rounded-lg"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-dark/95 backdrop-blur-xl border-b border-teal-accent/20 px-6 py-6 transition-all">
          <nav className="flex flex-col gap-4" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-cream/90 hover:text-gold-accent text-lg font-medium py-2 border-b border-teal-accent/10 transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {link.name}
              </a>
            ))}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-accent to-gold-accent text-primary-dark font-semibold rounded-full shadow-lg"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <FaWhatsapp className="w-5 h-5" />
              <span>Let's Talk on WhatsApp</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
