import { FileText, Download, Gem } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useInView } from "../hooks/useInView";

const catalogues = [
  {
    id: 1,
    title: "Jewellery Catalogue",
    description: "Complete collection of our exquisite gold and silver jewellery designs. Browse through our latest designs, collections, and premium pieces.",
    icon: FileText,
    link: "https://drive.google.com/file/d/1FJHXtCl1IVsHSep11GaobQEGrwX_EzFT/view?usp=drive_link",
    color: "from-yellow-400 to-gold-400",
  },
  {
    id: 2,
    title: "Gemstone Guide",
    description: "Comprehensive guide to precious and semi-precious gemstones. Learn about different gemstones, their characteristics, origins, and quality parameters.",
    icon: Gem,
    link: "https://drive.google.com/file/d/16QV_NCQIk1-rUmNvru2sTFxc03uxrVvd/view?usp=drive_link",
    color: "from-yellow-400 to-gold-400",
  },
];

export function Catalogues() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { ref, isVisible } = useInView(0.1);

  return (
    <section id="catalogues" className={`py-24 relative overflow-hidden ${isDark ? "bg-[#140e08]" : "bg-stone-50"}`}>
      <div className={`absolute top-0 left-0 w-full h-[1px] ${isDark ? "bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" : "bg-gradient-to-r from-transparent via-gold-300/50 to-transparent"}`} />
      <div className={`absolute -top-40 right-0 w-96 h-96 ${isDark ? "bg-gold-400/5" : "bg-gold-100/30"} rounded-full blur-[120px]`} />
      <div className={`absolute -bottom-40 left-0 w-96 h-96 ${isDark ? "bg-purple-400/5" : "bg-purple-100/30"} rounded-full blur-[120px]`} />

      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative scroll-reveal ${isVisible ? "visible" : ""}`}>
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-[1px] bg-gold-400" />
            <Download className="w-5 h-5 text-gold-400" />
            <div className="w-16 h-[1px] bg-gold-400" />
          </div>
          <h2 className={`font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold ${isDark ? "text-white" : "text-dark-brown"} mb-4`}>
            Our <span className="gold-text-gradient italic">Catalogues</span>
          </h2>
          <p className={`font-cormorant text-xl ${isDark ? "text-white/50" : "text-dark-brown/50"} max-w-2xl mx-auto italic`}>
            Download our comprehensive catalogues to explore more designs and discover perfect pieces
          </p>
        </div>

        {/* Catalogues Grid */}
        <div className={`stagger-children grid grid-cols-1 md:grid-cols-2 gap-8 ${isVisible ? "visible" : ""}`}>
          {catalogues.map((catalogue) => {
            const IconComponent = catalogue.icon;
            return (
              <a
                key={catalogue.id}
                href={catalogue.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-pointer ${
                  isDark
                    ? `bg-white/5 border ${catalogue.borderColor} ${catalogue.hoverBorder} hover:shadow-xl hover:shadow-gold-400/5`
                    : `bg-white border ${catalogue.borderColor} ${catalogue.hoverBorder} hover:shadow-2xl hover:shadow-gold-200/20`
                }`}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br ${catalogue.color}`} />

                {/* Content */}
                <div className="relative p-8 sm:p-10">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${catalogue.color} flex items-center justify-center shadow-lg shadow-gold-400/20 group-hover:scale-110 transition-transform duration-500`}>
                      <IconComponent className="w-8 h-8 text-dark-brown" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`font-playfair text-2xl sm:text-3xl font-semibold ${isDark ? "text-white group-hover:text-gold-300" : "text-dark-brown group-hover:text-gold-600"} mb-3 transition-colors`}>
                    {catalogue.title}
                  </h3>

                  {/* Description */}
                  <p className={`font-montserrat text-sm sm:text-base ${isDark ? "text-white/60" : "text-dark-brown/60"} leading-relaxed mb-6`}>
                    {catalogue.description}
                  </p>

                  {/* Download Button */}
                  <div className="flex items-center gap-3 text-gold-400 font-montserrat font-semibold text-sm group-hover:gap-4 transition-all duration-300">
                    <Download className="w-5 h-5" />
                    <span>View & Download</span>
                    <span className={`text-xl transition-transform duration-300 ${isDark ? "group-hover:translate-x-1" : "group-hover:translate-x-1"}`}>→</span>
                  </div>
                </div>

                {/* Hover effect - border glow */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl`} style={{
                  boxShadow: `inset 0 0 20px rgba(217, 119, 6, 0.1)`,
                }} />
              </a>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className={`mt-16 p-6 sm:p-8 rounded-2xl ${isDark ? "bg-white/5 border border-gold-400/10" : "bg-gold-50 border border-gold-200"}`}>
          <p className={`font-montserrat text-center ${isDark ? "text-white/70" : "text-dark-brown/70"}`}>
            <span className="text-gold-400 font-semibold"><a href="#contact">Contact us</a></span> for custom designs or more information about our collections.
          </p>
        </div>
      </div>
    </section>
  );
}
