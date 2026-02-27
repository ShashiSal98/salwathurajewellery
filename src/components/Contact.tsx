import { useState } from "react";
import { MapPin, Phone, Clock, Mail, Send, MessageCircle } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useInView } from "../hooks/useInView";

const contactInfo = [
  { icon: MapPin, title: "Visit Our Store", lines: ["Salwathura Jewellery", "Sri Lanka"] },
  { icon: Phone, title: "Call Us", lines: ["+94 71 628 6275"] },
  { icon: Clock, title: "Working Hours", lines: ["Monday - Saturday: 9.00AM - 7.00PM", "Sunday: 10.00AM - 4.00PM"] },
  { icon: Mail, title: "Email Us", lines: ["salwathurajewellery5@gmail.com"] },
];

const socialLinks = [
  { name: "Facebook", icon: FaFacebookF, url: "https://www.facebook.com/salwathurajewellery.lk/", hoverBg: "hover:bg-blue-600 hover:border-blue-600" },
  { name: "Instagram", icon: FaInstagram, url: "https://www.instagram.com/salwathurajewellery.lk", hoverBg: "hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 hover:border-pink-500" },
  { name: "TikTok", icon: FaTiktok, url: "https://www.tiktok.com/@salwathurajewellery.lk", hoverBg: "hover:bg-gray-800 hover:border-gray-800" },
];

export function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { ref, isVisible } = useInView(0.1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="contact" className={`py-24 relative overflow-hidden ${isDark ? "bg-[#140e08]" : "bg-stone-50"}`}>
      <div className={`absolute top-0 left-0 w-full h-[1px] ${isDark ? "bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" : "bg-gradient-to-r from-transparent via-gold-300/50 to-transparent"}`} />
      <div className={`absolute -top-40 -right-40 w-96 h-96 ${isDark ? "bg-gold-400/5" : "bg-gold-100/30"} rounded-full blur-[120px]`} />

      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative scroll-reveal ${isVisible ? "visible" : ""}`}>
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-[1px] bg-gold-400" />
            <MessageCircle className="w-5 h-5 text-gold-400" />
            <div className="w-16 h-[1px] bg-gold-400" />
          </div>
          <h2 className={`font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold ${isDark ? "text-white" : "text-dark-brown"} mb-4`}>
            Get in <span className="gold-text-gradient italic">Touch</span>
          </h2>
          <p className={`font-cormorant text-xl ${isDark ? "text-white/50" : "text-dark-brown/50"} max-w-2xl mx-auto italic`}>
            We'd love to hear from you. Visit our store or reach out through any of our channels
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className={`stagger-children grid grid-cols-1 sm:grid-cols-2 gap-4 ${isVisible ? "visible" : ""}`}>
              {contactInfo.map((info) => (
                <div
                  key={info.title}
                  className={`p-5 rounded-2xl transition-all duration-300 group hover:-translate-y-1 ${
                    isDark
                      ? "bg-white/5 border border-gold-400/10 hover:border-gold-400/30 hover:shadow-lg hover:shadow-gold-400/5"
                      : "bg-white border border-gray-100 hover:border-gold-300/40 hover:shadow-lg hover:shadow-gold-200/20"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                    <info.icon className="w-5 h-5 text-dark-brown" />
                  </div>
                  <h3 className={`font-playfair text-sm font-semibold ${isDark ? "text-white" : "text-dark-brown"} mb-2`}>{info.title}</h3>
                  {info.lines.map((line, i) => (
                    <p key={i} className={`font-montserrat text-xs ${isDark ? "text-white/40" : "text-dark-brown/50"}`}>{line}</p>
                  ))}
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className={`p-6 rounded-2xl ${isDark ? "bg-white/5 border border-gold-400/10" : "bg-white border border-gray-100 shadow-sm"}`}>
              <h3 className={`font-playfair text-lg font-semibold ${isDark ? "text-white" : "text-dark-brown"} mb-4`}>
                Follow Us on Social Media
              </h3>
              <p className={`font-montserrat text-sm ${isDark ? "text-white/40" : "text-dark-brown/50"} mb-6`}>
                Stay updated with our latest collections, offers, and behind-the-scenes content.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:text-white border ${
                      isDark ? "bg-white/10 border-gold-400/20 text-white" : "bg-gray-50 border-gray-200 text-dark-brown"
                    } ${social.hoverBg}`}
                    title={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Map-style decorative image */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-48 img-zoom">
              <img
                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=300&fit=crop"
                alt="Our Store"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className={`p-8 rounded-2xl ${isDark ? "bg-white/5 border border-gold-400/10" : "bg-white border border-gray-100 shadow-md"}`}>
            <h3 className={`font-playfair text-2xl font-semibold ${isDark ? "text-white" : "text-dark-brown"} mb-2`}>Send us a Message</h3>
            <p className={`font-montserrat text-sm ${isDark ? "text-white/40" : "text-dark-brown/50"} mb-8`}>Have a question or custom order request? Fill out the form below.</p>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4 animate-scale-in">
                  <Send className="w-7 h-7 text-dark-brown" />
                </div>
                <h4 className={`font-playfair text-xl ${isDark ? "text-white" : "text-dark-brown"} mb-2`}>Thank You!</h4>
                <p className={`font-montserrat text-sm ${isDark ? "text-white/50" : "text-dark-brown/50"}`}>We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={`block font-montserrat text-xs ${isDark ? "text-white/50" : "text-dark-brown/50"} tracking-wider uppercase mb-2`}>Your Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-montserrat focus:outline-none transition-all duration-300 border ${
                      isDark
                        ? "bg-white/5 border-gold-400/20 text-white placeholder:text-white/20 focus:border-gold-400/60"
                        : "bg-gray-50 border-gray-200 text-dark-brown placeholder:text-dark-brown/30 focus:border-gold-400 focus:bg-white"
                    }`}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={`block font-montserrat text-xs ${isDark ? "text-white/50" : "text-dark-brown/50"} tracking-wider uppercase mb-2`}>Email</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-montserrat focus:outline-none transition-all duration-300 border ${
                        isDark
                          ? "bg-white/5 border-gold-400/20 text-white placeholder:text-white/20 focus:border-gold-400/60"
                          : "bg-gray-50 border-gray-200 text-dark-brown placeholder:text-dark-brown/30 focus:border-gold-400 focus:bg-white"
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className={`block font-montserrat text-xs ${isDark ? "text-white/50" : "text-dark-brown/50"} tracking-wider uppercase mb-2`}>Phone</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-montserrat focus:outline-none transition-all duration-300 border ${
                        isDark
                          ? "bg-white/5 border-gold-400/20 text-white placeholder:text-white/20 focus:border-gold-400/60"
                          : "bg-gray-50 border-gray-200 text-dark-brown placeholder:text-dark-brown/30 focus:border-gold-400 focus:bg-white"
                      }`}
                      placeholder="+94 XX XXX XXXX"
                    />
                  </div>
                </div>
                <div>
                  <label className={`block font-montserrat text-xs ${isDark ? "text-white/50" : "text-dark-brown/50"} tracking-wider uppercase mb-2`}>Message</label>
                  <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-montserrat focus:outline-none transition-all duration-300 resize-none border ${
                      isDark
                        ? "bg-white/5 border-gold-400/20 text-white placeholder:text-white/20 focus:border-gold-400/60"
                        : "bg-gray-50 border-gray-200 text-dark-brown placeholder:text-dark-brown/30 focus:border-gold-400 focus:bg-white"
                    }`}
                    placeholder="Tell us about your requirements..."
                  />
                </div>
                <button type="submit" className="w-full py-4 gold-gradient-animated rounded-xl text-dark-brown font-montserrat text-sm tracking-widest uppercase font-semibold hover:shadow-lg hover:shadow-gold-400/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
