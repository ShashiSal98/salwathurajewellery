import { Award, Gem, Shield, Heart } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useInView } from "../hooks/useInView";

const features = [
  { icon: Gem, title: "Premium Quality", description: "Only the finest gold, diamonds, and precious gemstones sourced ethically" },
  { icon: Award, title: "Master Craftsmanship", description: "Each piece meticulously handcrafted by our skilled artisans" },
  { icon: Shield, title: "Certified & Hallmarked", description: "All jewellery comes with proper certification and hallmark guarantee" },
  { icon: Heart, title: "Custom Designs", description: "Bring your vision to life with our bespoke jewellery design service" },
];

const stats = [
  { number: "1000+", label: "Happy Customers" },
  { number: "500+", label: "Unique Designs" },
  { number: "100%", label: "Certified Gold" },
];

export function About() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { ref, isVisible } = useInView(0.1);

  return (
    <section id="about" className={`py-24 relative overflow-hidden ${isDark ? "bg-[#140e08]" : "bg-stone-50"}`}>
      <div className={`absolute top-0 left-0 w-full h-[1px] ${isDark ? "bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" : "bg-gradient-to-r from-transparent via-gold-300/50 to-transparent"}`} />
      <div className={`absolute -top-40 right-0 w-96 h-96 ${isDark ? "bg-gold-400/5" : "bg-gold-100/30"} rounded-full blur-[120px]`} />
      <div className={`absolute -bottom-40 left-0 w-96 h-96 ${isDark ? "bg-gold-400/5" : "bg-gold-100/30"} rounded-full blur-[120px]`} />

      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative scroll-reveal ${isVisible ? "visible" : ""}`}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image + Content */}
          <div>
            {/* Image collage */}
            <div className="relative mb-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-xl img-zoom h-48">
                    <img src="./src/assets/images/yellow sapphire.jpg"  alt="Gemstones" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl img-zoom h-32">
                    <img src="./src/assets/images/SJS e2.png" alt="Gold necklace" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-xl img-zoom h-32">
                    <img src="./src/assets/images/SJS r2.png"  alt="Diamond ring" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl img-zoom h-48">
                    <img src="./src/assets/images/SJS n1.png" alt="Gold jewelry" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              {/* Decorative badge */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 gold-gradient-animated rounded-2xl px-6 py-3 shadow-xl shadow-gold-400/20 flex items-center gap-3">
                <Gem className="w-5 h-5 text-dark-brown" />
                <span className="font-playfair text-sm font-bold text-dark-brown">Since Generations</span>
              </div>
            </div>

            <div className="mt-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-[1px] bg-gold-400" />
                <span className="text-gold-400 text-xs tracking-[0.3em] uppercase font-montserrat">Our Story</span>
              </div>
              <h2 className={`font-playfair text-4xl sm:text-5xl font-bold ${isDark ? "text-white" : "text-dark-brown"} mb-6 leading-tight`}>
                A Legacy of <span className="gold-text-gradient italic">Brilliance</span>
              </h2>
              <div className="space-y-4 mb-10">
                <p className={`font-cormorant text-xl ${isDark ? "text-white/70" : "text-dark-brown/70"} leading-relaxed italic`}>
                  For generations, Salwathura Jewellery has been synonymous with excellence
                  in the art of fine jewellery making in Sri Lanka.
                </p>
                <p className={`font-montserrat text-sm ${isDark ? "text-white/50" : "text-dark-brown/50"} leading-relaxed`}>
                  Every piece in our collection tells a story — of ancient traditions meeting
                  contemporary design, of precious metals and gemstones transformed by skilled
                  hands into wearable works of art.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className={`text-center p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-white"} shadow-sm`}>
                    <div className="font-playfair text-2xl sm:text-3xl font-bold gold-text-gradient">{stat.number}</div>
                    <div className={`font-montserrat text-[10px] ${isDark ? "text-white/40" : "text-dark-brown/40"} tracking-wider uppercase mt-1`}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Features Grid */}
          <div className={`stagger-children grid grid-cols-1 sm:grid-cols-2 gap-5 ${isVisible ? "visible" : ""}`}>
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group p-7 rounded-2xl transition-all duration-500 hover:-translate-y-1 ${
                  isDark
                    ? "bg-white/5 border border-gold-400/10 hover:border-gold-400/30 hover:bg-white/10 hover:shadow-xl hover:shadow-gold-400/5"
                    : "bg-white border border-gray-100 hover:border-gold-300/50 hover:shadow-xl hover:shadow-gold-200/20"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl gold-gradient-animated flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-gold-400/20">
                  <feature.icon className="w-6 h-6 text-dark-brown" />
                </div>
                <h3 className={`font-playfair text-lg font-semibold ${isDark ? "text-white" : "text-dark-brown"} mb-2`}>
                  {feature.title}
                </h3>
                <p className={`font-montserrat text-sm ${isDark ? "text-white/40" : "text-dark-brown/50"} leading-relaxed`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
