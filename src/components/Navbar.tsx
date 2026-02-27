import { useState, useEffect, useRef, type ReactNode } from "react";
import { Menu, X, Diamond, ChevronDown, ChevronRight, Sparkles, Sun, Moon, CircleDot, Gem, Crown, Star, Flame, Heart, Zap, CircleFadingArrowUp } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { navigateToCollection, type CollectionTab } from "../utils/navigationEvents";

interface SubItem {
  name: string;
  icon: ReactNode;
  tab: CollectionTab;
  subcategory: string;
}

interface NavItem {
  name: string;
  href: string;
  children?: SubItem[];
  description?: string;
  icon?: ReactNode;
  tab?: CollectionTab;
}

const navItems: NavItem[] = [
  // { name: "Home", href: "#home" },
  { name: "Today's Prices", href: "#prices" },
  {
    name: "Gold Collections",
    href: "#collections",
    description: "Exquisite 22K & 18K gold jewellery crafted to perfection",
    icon: <CircleDot className="w-5 h-5 text-yellow-500" />,
    tab: "gold",
    children: [
      { name: "Earrings", icon: <Sparkles className="w-4 h-4 text-gold-400" />, tab: "gold", subcategory: "Earrings" },
      { name: "Rings", icon: <Diamond className="w-4 h-4 text-gold-400" />, tab: "gold", subcategory: "Rings" },
      { name: "Necklaces", icon: <Gem className="w-4 h-4 text-gold-400" />, tab: "gold", subcategory: "Necklaces" },
      { name: "Bracelets", icon: <CircleFadingArrowUp className="w-4 h-4 text-gold-400" />, tab: "gold", subcategory: "Bracelets" },
    ],
  },
  {
    name: "Silver Collections",
    href: "#collections",
    description: "Premium 925 sterling silver with timeless elegance",
    icon: <CircleDot className="w-5 h-5 text-slate-400" />,
    tab: "silver",
    children: [
      { name: "Earrings", icon: <Sparkles className="w-4 h-4 text-slate-400" />, tab: "silver", subcategory: "Earrings" },
      { name: "Rings", icon: <Diamond className="w-4 h-4 text-slate-400" />, tab: "silver", subcategory: "Rings" },
      { name: "Necklaces", icon: <Gem className="w-4 h-4 text-slate-400" />, tab: "silver", subcategory: "Necklaces" },
      { name: "Bracelets", icon: <CircleFadingArrowUp className="w-4 h-4 text-slate-400" />, tab: "silver", subcategory: "Bracelets" },
    ],
  },
  {
    name: "Gem Collection",
    href: "#collections",
    description: "Precious & semi-precious gemstones from Sri Lanka",
    icon: <Gem className="w-5 h-5 text-purple-400" />,
    tab: "gem",
  },
  {
    name: "Collections",
    href: "#collections",
    description: "Browse our specially curated collections",
    icon: <Crown className="w-5 h-5 text-gold-400" />,
    tab: "curated",
    children: [
      { name: "New Arrivals", icon: <Star className="w-4 h-4 text-emerald-400" />, tab: "curated", subcategory: "New Arrivals" },
      { name: "Best Sellers", icon: <Flame className="w-4 h-4 text-amber-400" />, tab: "curated", subcategory: "Best Sellers" },
      { name: "Limited Edition", icon: <Zap className="w-4 h-4 text-yellow-400" />, tab: "curated", subcategory: "Limited Edition" },
      { name: "Wedding Collection", icon: <Heart className="w-4 h-4 text-pink-400" />, tab: "curated", subcategory: "Wedding Collection" },
      { name: "Everyday Essentials", icon: <Sparkles className="w-4 h-4 text-sky-400" />, tab: "curated", subcategory: "Everyday Essentials" },
    ],
  },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const gemItems: SubItem[] = [
  { name: "Explore All Gems", icon: <Gem className="w-4 h-4 text-purple-400" />, tab: "gem", subcategory: "All" },
  { name: "Sapphires", icon: <Gem className="w-4 h-4 text-blue-500" />, tab: "gem", subcategory: "Sapphires" },
  { name: "Rubies", icon: <Gem className="w-4 h-4 text-red-500" />, tab: "gem", subcategory: "Rubies" },
  { name: "Emeralds", icon: <Gem className="w-4 h-4 text-emerald-500" />, tab: "gem", subcategory: "Emeralds" },
];

/**
 * Helper function to get the correct nav link text color
 * based on theme (dark/light), scroll state, and hover.
 *
 * - Not scrolled (hero area): always white text (over hero image)
 * - Scrolled + Dark theme: white text
 * - Scrolled + Light theme: dark-brown text
 */
function getNavLinkColor(scrolled: boolean, isDark: boolean): string {
  if (!scrolled) {
    // Over hero — always white
    return "text-white/80 hover:text-gold-400";
  }
  // Scrolled — theme-dependent
  if (isDark) {
    return "text-white/80 hover:text-gold-400";
  }
  return "text-dark-brown/80 hover:text-gold-600";
}

function DesktopDropdown({
  item,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  closeDropdown,
  scrolled,
}: {
  item: NavItem;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  closeDropdown: () => void;
  scrolled: boolean;
}) {
  const { theme } = useTheme();
  const hasChildren = item.children && item.children.length > 0;
  const isGemCollection = item.name === "Gem Collection";
  const isDark = theme === "dark";

  const dropdownItems = hasChildren ? item.children! : isGemCollection ? gemItems : [];

  // Get theme-aware text color for this nav item
  const linkColor = getNavLinkColor(scrolled, isDark);

  const handleParentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.tab) {
      navigateToCollection(item.tab, "All");
      closeDropdown();
    }
  };

  const handleChildClick = (e: React.MouseEvent, child: SubItem) => {
    e.preventDefault();
    e.stopPropagation();
    navigateToCollection(child.tab, child.subcategory);
    closeDropdown();
  };

  const handleViewAllClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.tab) {
      navigateToCollection(item.tab, "All");
      closeDropdown();
    }
  };

  return (
    <div className="relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <a
        href={item.href}
        onClick={handleParentClick}
        className={`relative flex items-center gap-1 text-[13px] font-montserrat ${linkColor} tracking-wider uppercase transition-colors duration-300 group py-2`}
      >
        {item.name}
        {(hasChildren || isGemCollection) && (
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180 text-gold-400" : ""}`} />
        )}
        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold-400 transition-all duration-300 group-hover:w-full" />
      </a>

      {isOpen && dropdownItems.length > 0 && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
          <div className={`animate-slide-down ${isDark ? "bg-[#1a1208]/98" : "bg-white/98"} nav-blur border ${isDark ? "border-gold-400/15" : "border-gold-200/60"} rounded-2xl shadow-2xl shadow-black/20 overflow-hidden min-w-[280px]`}>
            <div className={`px-6 pt-5 pb-3 border-b ${isDark ? "border-gold-400/10" : "border-gold-100"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span>{item.icon}</span>
                <h3 className={`font-playfair text-base font-semibold ${isDark ? "text-white" : "text-dark-brown"}`}>{item.name}</h3>
              </div>
              <p className={`font-montserrat text-[11px] ${isDark ? "text-white/35" : "text-dark-brown/40"} leading-relaxed`}>{item.description}</p>
            </div>
            <div className="p-3">
              {dropdownItems.map((child) => (
                <a
                  key={child.name}
                  href="#collections"
                  onClick={(e) => handleChildClick(e, child)}
                  className={`group/item flex items-center gap-3 px-4 py-3 rounded-xl ${isDark ? "hover:bg-white/5" : "hover:bg-gold-50"} transition-all duration-200 cursor-pointer`}
                >
                  <span className="w-6 flex items-center justify-center group-hover/item:scale-125 transition-transform duration-200">{child.icon}</span>
                  <span className={`font-montserrat text-sm ${isDark ? "text-white/70" : "text-dark-brown/70"} group-hover/item:text-gold-500 tracking-wide transition-colors duration-200`}>{child.name}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isDark ? "text-white/20" : "text-dark-brown/20"} group-hover/item:text-gold-400/60 ml-auto opacity-0 group-hover/item:opacity-100 transition-all duration-200`} />
                </a>
              ))}
            </div>
            <div className="px-4 pb-4 pt-1">
              <a
                href="#collections"
                onClick={handleViewAllClick}
                className={`block text-center py-2.5 rounded-xl ${isDark ? "bg-gold-400/10 border-gold-400/20 hover:bg-gold-400/20" : "bg-gold-50 border-gold-200 hover:bg-gold-100"} border transition-all duration-300 cursor-pointer`}
              >
                <span className="font-montserrat text-[11px] text-gold-500 tracking-widest uppercase font-medium">View All {item.name}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileAccordion({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const hasDropdown = item.children?.length || item.name === "Gem Collection";

  if (!hasDropdown) {
    return (
      <a href={item.href} onClick={onClose} className={`${isDark ? "text-white/80 hover:text-gold-400 hover:bg-white/5" : "text-dark-brown/80 hover:text-gold-600 hover:bg-gold-50"} px-4 py-3 rounded-lg text-sm tracking-wider uppercase font-montserrat transition-all flex items-center`}>
        {item.name}
      </a>
    );
  }

  const subItems = item.name === "Gem Collection" ? gemItems : item.children!;

  const handleSubItemClick = (e: React.MouseEvent, child: SubItem) => {
    e.preventDefault();
    navigateToCollection(child.tab, child.subcategory);
    onClose();
  };

  const handleParentViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.tab) {
      navigateToCollection(item.tab, "All");
      onClose();
    }
  };

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full ${isDark ? "text-white/80 hover:text-gold-400 hover:bg-white/5" : "text-dark-brown/80 hover:text-gold-600 hover:bg-gold-50"} px-4 py-3 rounded-lg text-sm tracking-wider uppercase font-montserrat transition-all flex items-center justify-between`}
      >
        <span className="flex items-center gap-2">
          <span>{item.icon}</span>
          {item.name}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180 text-gold-400" : ""}`} />
      </button>
      {expanded && (
        <div className={`ml-4 pl-4 border-l ${isDark ? "border-gold-400/15" : "border-gold-200"} space-y-0.5 py-1 animate-slide-down`}>
          {subItems.map((child) => (
            <a
              key={child.name}
              href="#collections"
              onClick={(e) => handleSubItemClick(e, child)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg ${isDark ? "text-white/60 hover:text-gold-400 hover:bg-white/5" : "text-dark-brown/60 hover:text-gold-600 hover:bg-gold-50"} text-sm font-montserrat transition-all cursor-pointer`}
            >
              <span>{child.icon}</span>
              {child.name}
            </a>
          ))}
          {/* View All link for mobile */}
          <a
            href="#collections"
            onClick={handleParentViewAll}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-montserrat transition-all cursor-pointer ${isDark ? "text-gold-400/70 hover:text-gold-400 hover:bg-white/5" : "text-gold-600/70 hover:text-gold-600 hover:bg-gold-50"}`}
          >
            <Crown className="w-4 h-4" />
            View All {item.name}
          </a>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1280) setIsOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  // Get the nav link color for simple (non-dropdown) items
  const simpleLinkColor = getNavLinkColor(scrolled, isDark);

  // Logo text color
  const logoColor = scrolled
    ? isDark ? "text-white" : "text-dark-brown"
    : "text-white";

  // Theme toggle styling
  const themeToggleClass = scrolled
    ? isDark
      ? "bg-white/10 hover:bg-white/20 text-gold-400"
      : "bg-dark-brown/5 hover:bg-dark-brown/10 text-gold-600"
    : "bg-white/10 hover:bg-white/20 text-gold-400";

  // Mobile hamburger color
  const hamburgerColor = scrolled
    ? isDark
      ? "text-white hover:bg-white/5"
      : "text-dark-brown hover:bg-dark-brown/5"
    : "text-white hover:bg-white/5";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? `nav-blur ${isDark ? "bg-[#0f0a06]/95" : "bg-white/90"} shadow-lg ${isDark ? "shadow-black/20" : "shadow-gold-200/20"} py-2`
        : "bg-transparent py-4"
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group shrink-0">
            {/* <div className="relative">
              <Diamond className="w-8 h-8 text-gold-400 transition-transform duration-300 group-hover:rotate-12" />
              <div className="absolute inset-0 w-8 h-8 bg-gold-400/20 rounded-full blur-md group-hover:blur-lg transition-all" />
            </div> */}
            <div className="flex flex-col">
              <img
                src={isDark ? "./src/assets/images/footer SJ_logo.png" : "./src/assets/images/SJ_logo.png"}
                alt="Salwathura Jewellery"
                className="h-10 w-auto object-contain"
              />
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-6">
            {navItems.map((item) => {
              const hasDropdown = item.children?.length || item.name === "Gem Collection";
              if (hasDropdown) {
                return (
                  <DesktopDropdown
                    key={item.name}
                    item={item}
                    isOpen={openDropdown === item.name}
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                    closeDropdown={closeDropdown}
                    scrolled={scrolled}
                  />
                );
              }
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative text-[13px] font-montserrat ${simpleLinkColor} tracking-wider uppercase transition-colors duration-300 group py-2`}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold-400 transition-all duration-300 group-hover:w-full" />
                </a>
              );
            })}
          </div>

          {/* Right side: Theme toggle + CTA */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${themeToggleClass}`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-5 h-5 transition-transform duration-500 hover:rotate-90" />
              ) : (
                <Moon className="w-5 h-5 transition-transform duration-500 hover:-rotate-12" />
              )}
            </button>

            {/* Desktop CTA */}
            <a
              href="#contact"
              className="hidden xl:inline-flex items-center gap-2 px-5 py-2 gold-gradient-animated text-dark-brown font-montserrat text-[11px] tracking-widest uppercase font-semibold rounded-full hover:shadow-lg hover:shadow-gold-400/30 hover:scale-105 transition-all duration-300 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Visit Store
            </a>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`xl:hidden p-2 rounded-lg transition-colors ${hamburgerColor}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="xl:hidden mt-4 pb-4 animate-slide-down">
            <div className={`flex flex-col gap-0.5 ${isDark ? "bg-[#1a1208]/98" : "bg-white/98"} nav-blur rounded-2xl p-3 border ${isDark ? "border-gold-400/10" : "border-gold-200/40"} max-h-[75vh] overflow-y-auto shadow-xl`}>
              <div className="flex items-center justify-center gap-2 py-2 mb-1 border-b border-gold-400/10">
                <div className="w-8 h-[1px] bg-gold-400/40" />
                <Sparkles className="w-3 h-3 text-gold-400/60" />
                <span className="font-montserrat text-[10px] text-gold-400/50 tracking-[0.3em] uppercase">Menu</span>
                <Sparkles className="w-3 h-3 text-gold-400/60" />
                <div className="w-8 h-[1px] bg-gold-400/40" />
              </div>
              {navItems.map((item) => (
                <MobileAccordion key={item.name} item={item} onClose={() => setIsOpen(false)} />
              ))}
              <div className={`mt-3 pt-3 border-t ${isDark ? "border-gold-400/10" : "border-gold-200/30"}`}>
                <a href="#contact" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 py-3 gold-gradient rounded-xl text-dark-brown font-montserrat text-xs tracking-widest uppercase font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Visit Store
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
