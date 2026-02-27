import { Star, Quote } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useInView } from "../hooks/useInView";

const testimonials = [
  {
    name: "Amaya Perera",
    role: "Bride",
    text: "Salwathura Jewellery made my wedding day truly special. The bridal set was absolutely stunning and the craftsmanship was beyond my expectations.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Kasun Fernando",
    role: "Regular Customer",
    text: "I've been buying gold jewellery from Salwathura for years. Their quality is unmatched and the designs are always unique and beautiful.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Dilini Jayawardena",
    role: "Custom Order",
    text: "Had a custom engagement ring designed here. They understood exactly what I wanted and delivered a masterpiece. Attention to detail is remarkable!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Ruwan Silva",
    role: "Anniversary Gift",
    text: "Purchased a beautiful necklace for our anniversary. My wife absolutely loved it. Fair pricing and genuine gold quality. Never disappoints!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
];

export function Testimonials() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { ref, isVisible } = useInView(0.1);

  return (
    <section className={`py-24 relative overflow-hidden ${isDark ? "bg-[#0f0a06]" : "bg-white"}`}>
      <div className={`absolute top-0 left-0 w-full h-[2px] ${isDark ? "gold-gradient" : "bg-gradient-to-r from-transparent via-gold-300 to-transparent"}`} />

      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-reveal ${isVisible ? "visible" : ""}`}>
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-[1px] bg-gold-400" />
            <Quote className="w-5 h-5 text-gold-400" />
            <div className="w-16 h-[1px] bg-gold-400" />
          </div>
          <h2 className={`font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold ${isDark ? "text-white" : "text-dark-brown"} mb-4`}>
            What Our <span className="gold-text-gradient italic">Customers</span> Say
          </h2>
          <p className={`font-cormorant text-xl ${isDark ? "text-white/50" : "text-dark-brown/50"} max-w-2xl mx-auto italic`}>
            The trust and love of our customers is our greatest treasure
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className={`stagger-children grid grid-cols-1 md:grid-cols-2 gap-6 ${isVisible ? "visible" : ""}`}>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className={`group p-8 rounded-2xl transition-all duration-500 hover:-translate-y-1 ${
                isDark
                  ? "bg-white/5 border border-gold-400/10 hover:border-gold-400/30 hover:shadow-xl hover:shadow-gold-400/5"
                  : "bg-white border border-gray-100 hover:border-gold-300/50 hover:shadow-2xl hover:shadow-gold-200/20"
              }`}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <Quote className={`w-8 h-8 ${isDark ? "text-gold-400/15" : "text-gold-200"} mb-3`} />
              <p className={`font-cormorant text-lg ${isDark ? "text-white/70" : "text-dark-brown/70"} leading-relaxed mb-6 italic`}>
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gold-400/30 shadow-md"
                />
                <div>
                  <div className={`font-playfair font-semibold ${isDark ? "text-white" : "text-dark-brown"} text-sm`}>
                    {testimonial.name}
                  </div>
                  <div className={`font-montserrat text-xs ${isDark ? "text-gold-400/60" : "text-gold-500"}`}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
