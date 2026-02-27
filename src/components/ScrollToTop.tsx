import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
        isDark
          ? "gold-gradient shadow-gold-400/30"
          : "bg-dark-brown shadow-dark-brown/30 hover:bg-gold-600"
      }`}
      title="Scroll to top"
    >
      <ArrowUp className={`w-5 h-5 ${isDark ? "text-dark-brown" : "text-white"}`} />
    </button>
  );
}
