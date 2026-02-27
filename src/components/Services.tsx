import { Gem, Paintbrush, Wrench, Gift, Scale, Truck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useInView } from "../hooks/useInView";

const services = [
  { icon: Gem, title: "Custom Jewellery Design", description: "Bring your dream jewellery to life with our bespoke design service tailored to your vision.", image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=300&h=200&fit=crop" },
  { icon: Paintbrush, title: "Jewellery Restoration", description: "Breathe new life into cherished heirloom pieces with expert restoration services.", image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=300&h=200&fit=crop" },
  { icon: Wrench, title: "Repair & Resizing", description: "Professional ring resizing, chain repairs, and all types of jewellery restoration.", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=200&fit=crop" },
  { icon: Gift, title: "Bridal Collections", description: "Complete bridal jewellery packages for your special day — necklaces, earrings & more.", image: "/assets/images/SJS r2.png" },
  { icon: Scale, title: "Gold & Gem Valuation", description: "Get accurate valuations from certified experts for insurance or resale purposes.", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=200&fit=crop" },
  { icon: Truck, title: "Islandwide Service", description: "We serve customers across Sri Lanka. Contact us for arrangements at your convenience.", image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=300&h=200&fit=crop" },
];

export function Services() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { ref, isVisible } = useInView(0.1);

  return (
    <section id="services" className={`py-24 relative overflow-hidden ${isDark ? "bg-[#0f0a06]" : "bg-white"}`}>
      <div className={`absolute top-0 left-0 w-full h-[2px] ${isDark ? "gold-gradient" : "bg-gradient-to-r from-transparent via-gold-300 to-transparent"}`} />

      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative scroll-reveal ${isVisible ? "visible" : ""}`}>
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-[1px] bg-gold-400" />
            <Wrench className="w-5 h-5 text-gold-400" />
            <div className="w-16 h-[1px] bg-gold-400" />
          </div>
          <h2 className={`font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold ${isDark ? "text-white" : "text-dark-brown"} mb-4`}>
            Our <span className="gold-text-gradient italic">Services</span>
          </h2>
          <p className={`font-cormorant text-xl ${isDark ? "text-white/50" : "text-dark-brown/50"} max-w-2xl mx-auto italic`}>
            A complete range of professional services for all your jewellery needs
          </p>
        </div>

        {/* Services Grid */}
        <div className={`stagger-children grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isVisible ? "visible" : ""}`}>
          {services.map((service) => (
            <div
              key={service.title}
              className={`group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                isDark
                  ? "bg-white/5 border border-gold-400/10 hover:border-gold-400/30 hover:shadow-xl hover:shadow-gold-400/5"
                  : "bg-white border border-gray-100 hover:border-gold-300/40 hover:shadow-2xl hover:shadow-gold-200/20"
              }`}
            >
              {/* Mini image header */}
              <div className="h-36 overflow-hidden relative">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-transparent to-[#0f0a06]" : "bg-gradient-to-b from-transparent to-white"}`} />
                <div className="absolute bottom-4 left-6">
                  <div className="w-12 h-12 rounded-xl gold-gradient-animated flex items-center justify-center shadow-lg shadow-gold-400/20 group-hover:scale-110 transition-transform">
                    <service.icon className="w-5 h-5 text-dark-brown" />
                  </div>
                </div>
              </div>

              <div className="p-6 pt-3">
                <h3 className={`font-playfair text-xl font-semibold ${isDark ? "text-white group-hover:text-gold-300" : "text-dark-brown group-hover:text-gold-600"} mb-3 transition-colors`}>
                  {service.title}
                </h3>
                <p className={`font-montserrat text-sm ${isDark ? "text-white/40" : "text-dark-brown/50"} leading-relaxed`}>
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
