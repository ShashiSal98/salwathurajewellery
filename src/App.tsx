import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { PriceTicker, PriceBanner } from "./components/PriceTicker";
import { Collections } from "./components/Collections";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Gallery } from "./components/Gallery";
import { Testimonials } from "./components/Testimonials";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { SocialFloatingButtons } from "./components/SocialFloatingButtons";
import { ScrollToTop } from "./components/ScrollToTop";

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === "dark" ? "bg-[#0f0a06]" : "bg-white"
    }`}>
      <Navbar />
      <Hero />
      <PriceBanner />
      <PriceTicker />
      <Collections />
      <About />
      <Services />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
      <SocialFloatingButtons />
      <ScrollToTop />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
