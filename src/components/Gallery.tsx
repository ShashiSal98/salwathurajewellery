import { Sparkles, ExternalLink, Instagram, Camera } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useInView } from "../hooks/useInView";

const galleryItems = [
  { image: "./src/assets/images/SJ 2.png", title: "Royal Collection", subtitle: "22K Gold Heritage", size: "col-span-2 row-span-2" },
  { image: "./src/assets/images/SJS r1.png", title: "Engagement Rings", subtitle: "Diamond & Gem", size: "col-span-1 row-span-1" },
  { image: "./src/assets/images/SJS e2.png", title: "Elegant Earrings", subtitle: "Handcrafted", size: "col-span-1 row-span-1" },
  { image: "./src/assets/images/pink_sapphire.png", title: "Gemstone Collection", subtitle: "Ceylon's Finest", size: "col-span-1 row-span-2" },
  { image: "./src/assets/images/SJ b1.png", title: "Bracelets & Bangles", subtitle: "Timeless Beauty", size: "col-span-1 row-span-1" },
  { image: "./src/assets/images/SJS n2.png", title: "Necklaces", subtitle: "Signature Series", size: "col-span-2 row-span-1" },
];

const instagramPosts = [
  { image: "./src/assets/images/SJ 2swirl.png", href: "https://www.instagram.com/p/DU2sc0bDbn4/?igsh=MTlpaWN1YnBiYmVsYg==", likes: "2,345", caption: "Stunning 22K gold swirl pendant and earring set." },
  { image: "./src/assets/images/SJ e2.png", href: "https://www.instagram.com/p/DU2sc0bDbn4/?igsh=MTlpaWN1YnBiYmVsYg==", likes: "1,892", caption: "Elegant gold hoop earrings" },
  { image: "./src/assets/images/SJ 2.png", href: "https://www.instagram.com/p/DU2sc0bDbn4/?igsh=MTlpaWN1YnBiYmVsYg==", likes: "3,127", caption: "22K Gold bangles - traditional craftsmanship" },
  { image: "./src/assets/images/SJ e1.png", href: "https://www.instagram.com/p/DU2sc0bDbn4/?igsh=MTlpaWN1YnBiYmVsYg==", likes: "2,654", caption: "Diamond engagement ring" },
  { image: "./src/assets/images/SJ n1.png", href: "https://www.instagram.com/p/DU2sc0bDbn4/?igsh=MTlpaWN1YnBiYmVsYg==", likes: "4,210", caption: "Bridal necklace collection" },
  { image: "./src/assets/images/SJ r12.png", href: "https://www.instagram.com/p/DU2sc0bDbn4/?igsh=MTlpaWN1YnBiYmVsYg==", likes: "1,567", caption: "Heritage gold necklace set" },
];

export function Gallery() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { ref, isVisible } = useInView(0.1);

  return (
    <section id="gallery" className={`py-24 relative overflow-hidden ${isDark ? "bg-[#140e08]" : "bg-stone-50"}`}>
      <div className={`absolute top-0 left-0 w-full h-[1px] ${isDark ? "bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" : "bg-gradient-to-r from-transparent via-gold-300/50 to-transparent"}`} />

      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative scroll-reveal ${isVisible ? "visible" : ""}`}>
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-[1px] bg-gold-400" />
            <Camera className="w-5 h-5 text-gold-400" />
            <div className="w-16 h-[1px] bg-gold-400" />
          </div>
          <h2 className={`font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold ${isDark ? "text-white" : "text-dark-brown"} mb-4`}>
            Our <span className="gold-text-gradient italic">Gallery</span>
          </h2>
          <p className={`font-cormorant text-xl ${isDark ? "text-white/50" : "text-dark-brown/50"} max-w-2xl mx-auto italic`}>
            A glimpse into our world of exquisite craftsmanship and timeless beauty
          </p>
        </div>

        {/* Gallery Grid */}
        <div className={`stagger-children grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px] sm:auto-rows-[220px] ${isVisible ? "visible" : ""}`}>
          {galleryItems.map((item) => (
            <div
              key={item.title}
              className={`${item.size} group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-shadow duration-500`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10 opacity-60 group-hover:opacity-90 transition-all duration-500" />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-gold-400 text-[10px] font-montserrat tracking-[0.2em] uppercase block mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {item.subtitle}
                  </span>
                  <h3 className="font-playfair text-base sm:text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
                    <span className="text-xs font-montserrat text-gold-400 tracking-wider uppercase">View</span>
                  </div>
                </div>
              </div>

              {/* Gold border on hover */}
              <div className="absolute inset-0 border-2 border-gold-400/0 group-hover:border-gold-400/30 rounded-2xl transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Instagram Feed Section */}
        <div className="mt-20">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className={`w-12 h-[1px] ${isDark ? "bg-gold-400/40" : "bg-gold-300"}`} />
            <div className="flex items-center gap-2">
              <Instagram className="w-5 h-5 text-gold-400" />
              <span className={`font-montserrat text-xs tracking-[0.3em] uppercase ${isDark ? "text-gold-400/70" : "text-gold-600"}`}>
                Follow us on Instagram
              </span>
            </div>
            <div className={`w-12 h-[1px] ${isDark ? "bg-gold-400/40" : "bg-gold-300"}`} />
          </div>

          <p className={`text-center font-cormorant text-lg italic mb-8 ${isDark ? "text-white/40" : "text-dark-brown/40"}`}>
            @salwathurajewellery.lk
          </p>

          {/* Instagram Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {instagramPosts.map((post, index) => (
              <a
                key={index}
                href="https://www.instagram.com/salwathurajewellery.lk"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Instagram overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                    <Instagram className="w-6 h-6 text-white" />
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-red-400" />
                      <span className="text-white text-xs font-montserrat font-semibold">{post.likes}</span>
                    </div>
                  </div>
                </div>

                {/* Border on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-400/40 rounded-xl transition-all duration-300" />
              </a>
            ))}
          </div>
        </div>

        {/* Social CTA */}
        <div className="text-center mt-14">
          <p className={`font-cormorant text-lg ${isDark ? "text-white/40" : "text-dark-brown/40"} italic mb-4`}>
            Follow us on social media to see our latest creations
          </p>
          <div className="flex justify-center gap-4">
            <a href="https://www.instagram.com/salwathurajewellery.lk" target="_blank" rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-montserrat tracking-wider uppercase transition-all duration-300 border ${isDark ? "border-gold-400/20 text-gold-400 hover:bg-gold-400/10" : "border-gold-300 text-gold-600 hover:bg-gold-50"}`}>
              <Instagram className="w-3.5 h-3.5" />
              Instagram
            </a>
            <a href="https://www.tiktok.com/@salwathurajewellery.lk" target="_blank" rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-montserrat tracking-wider uppercase transition-all duration-300 border ${isDark ? "border-gold-400/20 text-gold-400 hover:bg-gold-400/10" : "border-gold-300 text-gold-600 hover:bg-gold-50"}`}>
              <Sparkles className="w-3.5 h-3.5" />
              TikTok
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
