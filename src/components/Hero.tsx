import { ChevronDown, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const heroImages = [
  "./src/assets/images/SJ e1.png",
   "./src/assets/images/SJ 1.png",
 "./src/assets/images/SJS r1.png",
];

export function Hero() {
  const { theme: _theme } = useTheme();
  void _theme;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="./src/assets/images/hero2.png"
          alt="Luxury jewelry background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
      </div>

      {/* Animated decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gold-400/10 rounded-full blur-[100px] animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-400/8 rounded-full blur-[120px] animate-float-slow" style={{ animationDelay: "2s" }} />

      {/* Decorative sparkles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
          }}
        >
          <Sparkles
            className="w-3 h-3 text-gold-400/40"
            style={{
              animation: `sparkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        </div>
      ))}

      {/* Rotating decorative ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] border border-gold-400/5 rounded-full animate-rotate-slow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] border border-gold-400/8 rounded-full animate-rotate-slow pointer-events-none" style={{ animationDirection: "reverse", animationDuration: "30s" }} />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0 }}>
          <div className="w-16 sm:w-24 h-[1px] bg-gradient-to-r from-transparent to-gold-400/60" />
          <Diamond className="w-5 h-5 text-gold-400 animate-bounce-subtle" />
          <div className="w-16 sm:w-24 h-[1px] bg-gradient-to-l from-transparent to-gold-400/60" />
        </div>

        <p
          className="font-montserrat text-gold-400 text-xs sm:text-sm tracking-[0.5em] uppercase mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.4s", opacity: 0 }}
        >
          Exquisite Handcrafted Jewellery
        </p>

        <h1
          className="font-[--font-display] text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-6 animate-fade-in-up leading-[0.95] tracking-wider"
          style={{ animationDelay: "0.6s", opacity: 0 }}
        >
          Salwathura
          <br />
          <span className="animate-shimmer font-cormorant italic font-light text-[0.65em] tracking-[0.15em]">Jewellery</span>
        </h1>

        <p
          className="font-cormorant text-xl sm:text-2xl md:text-3xl text-white/70 mb-8 max-w-2xl mx-auto animate-fade-in-up italic"
          style={{ animationDelay: "0.8s", opacity: 0 }}
        >
          Where timeless elegance meets exceptional craftsmanship
        </p>

        {/* Floating image previews */}
        <div className="flex justify-center gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: "0.9s", opacity: 0 }}>
          {heroImages.map((img, i) => (
            <div
              key={i}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-gold-400/30 shadow-lg shadow-black/30 hover:scale-110 hover:border-gold-400/60 transition-all duration-500"
              style={{ animation: `float 4s ease-in-out infinite`, animationDelay: `${i * 0.6}s` }}
            >
              <img src={img} alt="Jewelry preview" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "1.1s", opacity: 0 }}>
          <a
            href="#collections"
            className="group relative inline-flex items-center gap-3 px-10 py-4 gold-gradient-animated text-dark-brown font-montserrat text-sm tracking-widest uppercase font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gold-400/40 hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span className="relative z-10">Explore Collections</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-10 py-4 border border-white/30 text-white font-montserrat text-sm tracking-widest uppercase font-medium rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
          >
            Visit Our Store
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <a href="#collections" className="flex flex-col items-center gap-2 text-gold-400/60 hover:text-gold-400 transition-colors">
          <span className="text-[10px] tracking-[0.3em] uppercase font-montserrat">Discover</span>
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}

function Diamond({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 13L2 9z" />
      <path d="M11 3l1 10" />
      <path d="M2 9h20" />
      <path d="M6.5 3L11 9" />
      <path d="M17.5 3L13 9" />
    </svg>
  );
}
