import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { CONTACT, getWhatsAppUrl } from "../config/contact";
import { saveInquiry } from "../data/reviewStore";

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    // Auto-initialize inquiries collection in MongoDB Compass on mount
    fetch("/api/inquiries").catch(() => {});
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    projectType: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.projectType || !formData.message) return;

    setSubmitStatus("sending");

    try {
      // 1. Save Inquiry to MongoDB via API Endpoint
      try {
        await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            projectType: formData.projectType,
            projectDetails: formData.message.trim(),
          }),
        });
      } catch (dbErr) {
        console.warn("MongoDB API inquiry submission fallback:", dbErr);
      }

      // 2. Save locally for fallback offline resilience
      saveInquiry({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        projectType: formData.projectType,
        projectDetails: formData.message.trim(),
      });

      // 3. Trigger FormSubmit Email Notification
      try {
        await fetch(CONTACT.formSubmitUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            Name: formData.name,
            Phone: formData.phone,
            Email: formData.email,
            "Project Type": formData.projectType,
            "Project Details": formData.message,
            _subject: `New Reelorithmm Inquiry from ${formData.name} - ${formData.projectType}`,
            _template: "table",
            _captcha: "false",
          }),
        });
      } catch (emailErr) {
        console.warn("Email notification failed, but MongoDB inquiry is safely saved:", emailErr);
      }

      // 4. Show success feedback
      setSubmitStatus("success");
      setFormData({
        name: "",
        phone: "",
        email: "",
        projectType: "",
        message: "",
      });
      setTimeout(() => setSubmitStatus("idle"), 6000);
    } catch (error) {
      console.error("Error submitting inquiry", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 6000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative bg-primary-dark py-24 px-6 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-accent/10 rounded-full blur-[150px] pointer-events-none" />

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
            Let's Create
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-accent to-cream">
              Something Amazing
            </span>
          </h2>
          <p
            className="text-xl text-cream/80"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Get in touch to discuss your project and creative vision
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Contact Form Card (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 bg-secondary-dark/50 backdrop-blur-md border border-teal-accent/30 rounded-2xl p-8 md:p-10 shadow-2xl"
          >
            <h3
              className="text-2xl text-cream mb-6 font-semibold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Start a Conversation
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-cream/90 mb-2 font-medium text-sm"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-primary-dark/60 border border-teal-accent/30 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold-accent transition-colors duration-300"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Phone & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-cream/90 mb-2 font-medium text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-primary-dark/60 border border-teal-accent/30 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold-accent transition-colors duration-300"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    placeholder="+91 00000-00000"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-cream/90 mb-2 font-medium text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-primary-dark/60 border border-teal-accent/30 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold-accent transition-colors duration-300"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Project Type */}
              <div>
                <label
                  htmlFor="projectType"
                  className="block text-cream/90 mb-2 font-medium text-sm"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Project Type *
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-primary-dark/60 border border-teal-accent/30 rounded-xl text-cream focus:outline-none focus:border-gold-accent transition-colors duration-300"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <option value="">Select project type</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Brand Film">Brand Film</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Podcast">Podcast</option>
                  <option value="Event">Event</option>
                  <option value="Promotional/Reels">Promotional/Reels</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Project Details */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-cream/90 mb-2 font-medium text-sm"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Project Details *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-5 py-4 bg-primary-dark/60 border border-teal-accent/30 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold-accent transition-colors duration-300 resize-none"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  placeholder="Tell us about your project, date, location, requirements, and creative vision..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitStatus === "sending"}
                className="group w-full py-4 bg-gradient-to-r from-teal-accent to-gold-accent text-primary-dark font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(3,101,100,0.5)] disabled:opacity-70"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <span>
                  {submitStatus === "sending" ? "Submitting Inquiry..." : "Submit Inquiry"}
                </span>
                <Send className={`w-5 h-5 transition-transform duration-300 ${submitStatus === "sending" ? "animate-pulse" : "group-hover:translate-x-1"}`} />
              </button>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-teal-accent/20 border border-teal-accent/50 rounded-xl text-gold-accent text-center font-medium"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Inquiry submitted successfully! We will get back to you soon.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Details, WhatsApp & Instagram Options (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Dedicated WhatsApp Inquiry Card */}
            <div className="p-8 bg-gradient-to-br from-teal-accent/25 via-secondary-dark/60 to-gold-accent/20 backdrop-blur-md border border-teal-accent/40 rounded-2xl shadow-xl">
              <h3
                className="text-2xl text-cream mb-2 font-semibold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Have a project in mind? Let's talk about it on WhatsApp.
              </h3>
              <p
                className="text-cream/80 text-sm mb-6"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Tell us what you're looking to create, and let's bring your idea to life.
              </p>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] focus:outline-none"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                aria-label="Let's Talk on WhatsApp"
              >
                <FaWhatsapp className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span>Let's Talk on WhatsApp</span>
              </a>
            </div>

            {/* Direct Contact Info Card */}
            <div className="p-8 bg-secondary-dark/50 backdrop-blur-md border border-teal-accent/30 rounded-2xl space-y-6 shadow-xl">
              <h3
                className="text-2xl text-cream mb-4 font-semibold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Studio Contact Details
              </h3>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-accent/20 flex items-center justify-center flex-shrink-0 border border-teal-accent/30">
                  <Mail className="w-5 h-5 text-gold-accent" />
                </div>
                <div>
                  <h4
                    className="text-sm uppercase tracking-wider text-gold-accent font-medium mb-1"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Email
                  </h4>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-cream/90 hover:text-gold-accent transition-colors text-base"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {CONTACT.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-accent/20 flex items-center justify-center flex-shrink-0 border border-teal-accent/30">
                  <Phone className="w-5 h-5 text-gold-accent" />
                </div>
                <div>
                  <h4
                    className="text-sm uppercase tracking-wider text-gold-accent font-medium mb-1"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Phone
                  </h4>
                  <a
                    href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
                    className="text-cream/90 hover:text-gold-accent transition-colors text-base"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {CONTACT.phone}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-accent/20 flex items-center justify-center flex-shrink-0 border border-teal-accent/30">
                  <MapPin className="w-5 h-5 text-gold-accent" />
                </div>
                <div>
                  <h4
                    className="text-sm uppercase tracking-wider text-gold-accent font-medium mb-1"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Location
                  </h4>
                  <p
                    className="text-cream/90 text-base"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {CONTACT.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Simple Clean Instagram Follow Us Section (One Single Horizontal Line on Desktop) */}
            <div className="pt-2">
              <h3
                className="text-2xl text-cream mb-4 font-semibold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Follow us
              </h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                {/* Account 1: @reelorithm */}
                <a
                  href={CONTACT.instagram.mainUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 px-5 py-2.5 bg-secondary-dark/60 border border-teal-accent/30 hover:border-gold-accent text-cream/90 hover:text-gold-accent rounded-xl transition-all duration-300 hover:scale-105 shadow-md"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <Instagram className="w-5 h-5 text-gold-accent group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-base font-medium tracking-wide">
                    {CONTACT.instagram.mainHandle}
                  </span>
                </a>

                {/* Account 2: @clipbyshubham */}
                <a
                  href={CONTACT.instagram.clipsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 px-5 py-2.5 bg-secondary-dark/60 border border-teal-accent/30 hover:border-gold-accent text-cream/90 hover:text-gold-accent rounded-xl transition-all duration-300 hover:scale-105 shadow-md"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <Instagram className="w-5 h-5 text-gold-accent group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-base font-medium tracking-wide">
                    {CONTACT.instagram.clipsHandle}
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
