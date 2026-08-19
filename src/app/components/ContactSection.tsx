import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { CONTACT, getWhatsAppUrl } from "../config/contact";

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    projectType: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("sending");

    try {
      // Send data to FormSubmit API without refreshing the page
      const response = await fetch(CONTACT.formSubmitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          Name: formData.name,
          Phone: formData.phone,
          "Project Type": formData.projectType,
          Message: formData.message,
          _subject: `New Inquiry from ${formData.name} - ${formData.projectType}`,
          _template: "table",
          _captcha: "false",
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Clear form after success
        setFormData({
          name: "",
          phone: "",
          projectType: "",
          message: "",
        });
        // Reset status after 5 seconds
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus("idle"), 5000);
      }
    } catch (error) {
      setSubmitStatus("error");
      console.error(error);
      setTimeout(() => setSubmitStatus("idle"), 5000);
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
      className="relative bg-background py-24 px-6 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-accent/10 rounded-full blur-[150px]" />

      <div className="max-w-6xl mx-auto relative z-10">
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
            Get in touch to discuss your project
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-cream/90 mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-secondary-dark/40 border border-teal-accent/30 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold-accent transition-colors duration-300"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  placeholder="Your name"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-cream/90 mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-secondary-dark/40 border border-teal-accent/30 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold-accent transition-colors duration-300"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  placeholder="+91  00000-00000"
                />
              </div>

              {/* Project Type */}
              <div>
                <label
                  htmlFor="projectType"
                  className="block text-cream/90 mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Project Type
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-secondary-dark/40 border border-teal-accent/30 rounded-xl text-cream focus:outline-none focus:border-gold-accent transition-colors duration-300"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <option value="">Select project type</option>
                  <option value="wedding">Wedding Cinematic Reel</option>
                  <option value="engagement">Engagement Shoot</option>
                  <option value="car">Car Cinematic Shoot</option>
                  <option value="brand">Brand Promotion</option>
                  <option value="social">Social Media Reels</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-cream/90 mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-6 py-4 bg-secondary-dark/40 border border-teal-accent/30 rounded-xl text-cream placeholder-cream/40 focus:outline-none focus:border-gold-accent transition-colors duration-300 resize-none"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitStatus === "sending"}
                className="group w-full py-4 bg-gradient-to-r from-teal-accent to-gold-accent text-primary-dark rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(3,101,100,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <span>
                  {submitStatus === "sending" ? "Sending..." : 
                   submitStatus === "success" ? "Message Sent!" : 
                   submitStatus === "error" ? "Failed - Try Again" : 
                   "Send Message"}
                </span>
                <Send className={`w-5 h-5 transition-transform duration-300 ${submitStatus === "sending" ? "animate-pulse" : "group-hover:translate-x-1"}`} />
              </button>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-center"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Message sent successfully! We will get back to you soon.
                </motion.div>
              )}
              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-center"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Failed to send message. Please try again or contact via WhatsApp.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* WhatsApp Quick Contact */}
            <div className="p-8 bg-gradient-to-br from-teal-accent/20 to-gold-accent/20 backdrop-blur-sm border border-teal-accent/30 rounded-2xl">
              <h3
                className="text-2xl text-cream mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Quick Contact
              </h3>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                aria-label="Chat on WhatsApp with a pre-filled inquiry message"
              >
                <FaWhatsapp className="w-6 h-6" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-accent/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-gold-accent" />
                </div>
                <div>
                  <h4
                    className="text-cream mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Email
                  </h4>
                  <p
                    className="text-cream/80"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {CONTACT.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-accent/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-gold-accent" />
                </div>
                <div>
                  <h4
                    className="text-cream mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Phone
                  </h4>
                  <p
                    className="text-cream/80"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {CONTACT.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-accent/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-gold-accent" />
                </div>
                <div>
                  <h4
                    className="text-cream mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Location
                  </h4>
                  <p
                    className="text-cream/80"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {CONTACT.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4
                className="text-cream mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Follow Me
              </h4>
              <div className="flex gap-4">
                <a
                  href={CONTACT.instagram.main}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-secondary-dark border border-teal-accent/30 flex items-center justify-center text-cream/70 hover:text-gold-accent hover:border-gold-accent transition-colors duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                 <a
                  href={CONTACT.instagram.clips}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-secondary-dark border border-teal-accent/30 flex items-center justify-center text-cream/70 hover:text-gold-accent hover:border-gold-accent transition-colors duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={CONTACT.instagram.personal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-secondary-dark border border-teal-accent/30 flex items-center justify-center text-cream/70 hover:text-gold-accent hover:border-gold-accent transition-colors duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
               
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
