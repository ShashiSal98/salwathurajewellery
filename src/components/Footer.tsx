import { Diamond, Heart } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const collectionLinks = [
  { name: "Gold Collections", href: "#collections" },
  { name: "Silver Collections", href: "#collections" },
  { name: "Gem Collection", href: "#collections" },
  { name: "New Arrivals", href: "#collections" },
  { name: "Best Sellers", href: "#collections" },
  { name: "Wedding Collection", href: "#collections" },
];

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "About Us", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Gallery", href: "#gallery" },
  { name: "Contact", href: "#contact" },
];

const socialLinks = [
  { name: "Facebook", icon: FaFacebookF, url: "https://www.facebook.com/salwathurajewellery.lk/", handle: "/salwathurajewellery.lk" },
  { name: "Instagram", icon: FaInstagram, url: "https://www.instagram.com/salwathurajewellery.lk", handle: "@salwathurajewellery.lk" },
  { name: "TikTok", icon: FaTiktok, url: "https://www.tiktok.com/@salwathurajewellery.lk", handle: "@salwathurajewellery.lk" },
];

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer className={`relative overflow-hidden ${isDark ? "bg-[#0a0705]" : "bg-dark-brown"}`}>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
           <a href="#home" className="flex items-center gap-3 mb-6">
              {/* <Diamond className="w-7 h-7 text-gold-400" /> */}
              <img src="/assets/images/footer SJ_logo.png" alt="Salwathura Jewellery" className="h-10 w-auto object-contain" />
            </a>
            <p className="font-montserrat text-sm text-white/30 leading-relaxed mb-6">
              Crafting timeless pieces of elegance and beauty. Your trusted jewellery destination in Sri Lanka.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-gold-400/10 flex items-center justify-center text-white/50 hover:text-gold-400 hover:border-gold-400/30 hover:bg-white/10 transition-all duration-300"
                  title={social.name}>
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-white mb-6">Collections</h4>
            <ul className="space-y-3">
              {collectionLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="font-montserrat text-sm text-white/30 hover:text-gold-400 transition-colors duration-300">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="font-montserrat text-sm text-white/30 hover:text-gold-400 transition-colors duration-300">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Connected */}
          <div>
            <h4 className="font-playfair text-lg font-semibold text-white mb-6">Stay Connected</h4>
            <p className="font-montserrat text-sm text-white/30 mb-6 leading-relaxed">
              Follow us on social media for the latest collections and exclusive offers.
            </p>
            <div className="space-y-3">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-gold-400/10 hover:border-gold-400/30 hover:bg-white/10 transition-all group">
                  <social.icon className="w-4 h-4 text-gold-400" />
                  <span className="font-montserrat text-sm text-white/50 group-hover:text-white/80 transition-colors">{social.handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-montserrat text-xs text-white/20">© {new Date().getFullYear()} Salwathura Jewellery. All rights reserved.</p>
            <p className="font-montserrat text-xs text-white/20 flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> in Sri Lanka
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
