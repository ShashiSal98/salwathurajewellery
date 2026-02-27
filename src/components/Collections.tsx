import { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { Sparkles, Eye, Crown, ChevronRight, Heart, CircleDot, Gem, Search } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useInView } from "../hooks/useInView";
import { ProductModal, type Product } from "./ProductModal";
import { onCollectionNavigate } from "../utils/navigationEvents";

type CollectionTab = "gold" | "silver" | "gem" | "curated";

const tabConfig: { key: CollectionTab; label: string; icon: ReactNode; description: string }[] = [
  { key: "gold", label: "Gold Collections", icon: <CircleDot className="w-4 h-4 text-yellow-500" />, description: "Exquisite 22K & 18K gold jewellery" },
  { key: "silver", label: "Silver Collections", icon: <CircleDot className="w-4 h-4 text-slate-400" />, description: "Premium 925 sterling silver" },
  { key: "gem", label: "Gem Collection", icon: <Gem className="w-4 h-4 text-purple-400" />, description: "Precious Sri Lankan gemstones" },
  { key: "curated", label: "Curated Collections", icon: <Crown className="w-4 h-4 text-gold-400" />, description: "Specially curated for you" },
];

const goldSubcategories = ["All", "Earrings", "Rings", "Necklaces", "Bracelets"];
const silverSubcategories = ["All", "Earrings", "Rings", "Necklaces", "Bracelets"];
const curatedSubcategories = ["All", "New Arrivals", "Best Sellers", "Limited Edition", "Wedding Collection", "Everyday Essentials"];

const goldProducts: Product[] = [
  {
    id: 1, name: "Gold Aura Circle Necklace", category: "Necklaces", price: "LKR 285,000",
    description: "22K gold necklace with an Aura circular pendant",
    image: "/assets/images/SJ n5.png",
    images: [
      "/assets/images/SJ n5.png",
    ],
  },
  {
    id: 2, name: "Gold Celestial Orbit Ring", category: "Rings", price: "LKR 145,000",
    description: "22K gold ring featuring center stone in a radiant circular halo setting",
    image: "/assets/images/SJ r12.png",
    images: [
      "/assets/images/SJ r12.png",
    ],
  },
  {
    id: 3, name: "Gold Huggie Hoop with Solitaire Diamond", category: "Earrings", price: "LKR 78,000",
    description: "22K gold huggie hoop earrings featuring a sparkling solitaire diamond",
    image: "/assets/images/SJ e1.png",
    images: [
      "/assets/images/SJ e1.png",
    ],
  },
  {
    id: 4, name: "Gold Open Cuff Bracelet", category: "Bracelets", price: "LKR 165,000",
    description: "22K gold slim open cuff with bezel-set round diamonds.",
    image: "/assets/images/SJ b1.png",
    images: [
      "/assets/images/SJ b1.png",
    ],
  },
  {
    id: 5, name: "Gold Trinity Orb Ring", category: "Rings", price: "LKR 195,000",
    description: "22K gold symbolic design featuring the three points of the inner triangle held within a surrounding circle",
    image: "/assets/images/SJ r14.png",
    images: [
      "/assets/images/SJ r14.png",
    ],
  },
  {
    id: 6, name: "Gold Petal Earrings", category: "Earrings", price: "LKR 55,000",
    description: "Classic 22K gold petal earrings",
    image: "/assets/images/SJ e2.png",
    images: [
      "/assets/images/SJ e2.png",
    ],
  },
  {
    id: 7, name: "Gold Triangle Necklace", category: "Necklaces", price: "LKR 425,000",
    description: "22K gold triangle pendant featuring a sparkling solitaire",
    image: "/assets/images/SJ n6.png",
    images: [
      "/assets/images/SJ n6.png",
    ],
  },
  {
    id: 8, name: "Gold Dainty Bead Bracelet", category: "Bracelets", price: "LKR 210,000",
    description: "22K gold satellite chain with dainty beads and an adjustable clasp",
    image: "/assets/images/SJ b2.png",
    images: [
      "/assets/images/SJ b2.png",
    ],
  },
];

const silverProducts: Product[] = [
  {
    id: 9, name: "Silver Citrine Halo Necklace", category: "Necklaces", price: "LKR 18,500",
    description: "925 sterling silver necklace featuring a radiant sunburst yellow citrine pendant",
    image: "/assets/images/SJS n1.png",
    images: [
      "/assets/images/SJS n1.png",
    ],
  },
  {
    id: 10, name: "Silver Oval Ruby Ring", category: "Rings", price: "LKR 8,500",
    description: "Handcrafted 925 silver ring featuring an oval-cut ruby-red gemstone in a minimalist setting",
    image: "/assets/images/SJS r1.png",
    images: [
      "/assets/images/SJS r1.png",
    ],
  },
  {
    id: 11, name: "Silver Swiss Blue Topaz Earrings", category: "Earrings", price: "LKR 6,200",
    description: "925 silver Natural Swiss Blue Topaz Earrings",
    image: "/assets/images/SJS e1.png",
    images: [
      "/assets/images/SJS e1.png",
    ],
  },
  {
    id: 12, name: "Silver Ruby Bracelet", category: "Bracelets", price: "LKR 12,500",
    description: "925 sterling silver oval cut ruby bracelet",
    image: "/assets/images/SJS b1.png",
    images: [
      "/assets/images/SJS b1.png",
    ],
  },
  {
    id: 13,  name: "Silver Karma Studs",
    category: "Earrings",
    price: "LKR 4,800",
    description: "Minimalist 925 Sterling Silver Karma Open Circle Stud Earrings",
    image:  "/assets/images/SJS e3.png" ,
    images: [
      "/assets/images/SJS e3.png",
    ],
  },
  {
    id: 14, name: "Silver Oval Amethyst Solitaire Necklace", category: "Necklaces", price: "LKR 15,800",
    description: "Minimalist 925 Sterling Silver necklace featuring a deep oval-cut amethyst pendant",
    image: "/assets/images/SJS n2.png",
    images: [
      "/assets/images/SJS n2.png",
    ],
  },
  {
    id: 15, name: "Silver Vesta Arc Ring", category: "Rings", price: "LKR 3,500",
    description: "Minimalist 925 Silver Vesta Arc Ring",
    image: "/assets/images/SJS r2.png",
    images: [
      "/assets/images/SJS r2.png",
    ],
  },
  {
    id: 16, name: "Silver Tennis Bracelet", category: "Bracelets", price: "LKR 22,000",
    description: "Vintage Mixed Gemstone 925 Sterling Silver Tennis Bracelet",
    image: "/assets/images/SJS b2.png",
    images: [
      "/assets/images/SJS b2.png",
    ],
  },
];

const gemProducts: Product[] = [
  {
    id: 17, name: "Blue Sapphire", category: "Sapphires", price: "LKR 350,000",
    description: "0_165 Cts Natural Blue Sapphire",
    image: "/assets/images/blue_sapphire.png", tag: "Premium",
    images: [
      "/assets/images/blue_sapphire.png",
     "/assets/images/blue sapphire.jpg",
    ],
  },
  {
    id: 18, name: "Ruby", category: "Rubies", price: "LKR 185,000",
    description: "Perl Cut Ruby",
    image: "/assets/images/ruby.png", tag: "Rare",
    images: [
      "/assets/images/ruby.png",
    ],
  },
  {
    id: 19, name: "Emerald", category: "Emeralds", price: "LKR 275,000",
    description: "Natural emerald",
    image: "/assets/images/emerald.jpg", tag: "Exclusive",
    images: [
      "/assets/images/emerald.jpg",
    ],
  },
  {
    id: 20, name: "Moonstone", category: "Moonstone", price: "LKR 120,000",
    description: "Sri Lankan Moonstone chrysoberyl",
    image: "/assets/images/moonstone.png",
    images: [
      "/assets/images/moonstone.png",
    ],
  },
  {
    id: 21, name: "Yellow Sapphire", category: "Sapphires", price: "LKR 520,000",
    description: "1_01 Cts Natural Yellow Sapphire Loose Gemstone Oval Cut",
    image: "/assets/images/yellow_sapphire.png", tag: "Collector",
    images: [
      "/assets/images/yellow_sapphire.png",
    ],
  },
  {
    id: 22, name: "Pink Sapphire", category: "Sapphires", price: "LKR 290,000",
    description: "0_69 Cts Natural Fancy Pink Sapphire Loose Gemstone Oval Cut",
    image: "/assets/images/pink_sapphire.png", tag: "Collector",
    images: [
      "/assets/images/pink_sapphire.png",
    ],
  },
  {
    id: 23, name: "Amethyst", category: "Amethyst", price: "LKR 480,000",
    description: "Natural Amethyst Loose Gemstones",
    image: "/assets/images/amethyst.png", tag: "Museum Grade",
    images: [
      "/assets/images/amethyst.png",
    ],
  },
  {
    id: 24, name: "Imperial Champagne Topaz", category: "Topaz", price: "LKR 65,000",
    description: "7_45Cts Natural Imperial Champagne Topaz",
    image: "/assets/images/topaz.jpg", 
    images: [
      "/assets/images/topaz.jpg",
    ],
  },
];

const curatedProducts: Product[] = [
  {
    id: 25, name: "Silver Oval Ruby Ring", category: "New Arrivals", price: "LKR 8,000",
    description: "Handcrafted 925 silver ring featuring an oval-cut ruby-red gemstone in a minimalist setting",
    image: "/assets/images/SJS r1.png", tag: "NEW",
    images: [
      "/assets/images/SJS r1.png",
    ],
  },
  {
    id: 26, name: "Tennis Bracelet", category: "Best Sellers", price: "LKR 385,000",
    description: "18K white gold with 3ct diamonds",
    image: "/assets/images/SJ b1.png", tag: "BESTSELLER",
    images: [
      "/assets/images/SJ b1.png",
    ],
  },
  {
    id: 27, name: "Heritage Navaratna Set", category: "Limited Edition", price: "LKR 650,000",
    description: "Nine gemstones in 22K gold",
    image: "/assets/images/SJ 1.png", tag: "LIMITED",
    images: [
      "/assets/images/SJ 1.png",
    ],
  },
  {
    id: 28, name: "Bridal Ring", category: "Wedding Collection", price: "LKR 890,000",
    description: "Complete bridal jewellery set",
    image: "/assets/images/SJS r2.png", tag: "BRIDAL",
    images: [
      "/assets/images/SJS r2.png",
    ],
  },
  {
    id: 29, name: "Minimalist Chain", category: "Everyday Essentials", price: "LKR 35,000",
    description: "18K gold dainty everyday chain",
    image: "/assets/images/SJS n1.png", tag: "DAILY",
    images: [
      "/assets/images/SJS n1.png",
    ],
  },
  {
    id: 30, name: "Pearl Drop Earrings", category: "New Arrivals", price: "LKR 42,000",
    description: "Freshwater pearl in 18K gold",
    image: "/assets/images/SJS e1.png", tag: "NEW",
    images: [
      "/assets/images/SJS e1.png",
    ],
  },
  {
    id: 31, name: "Solitaire Diamond Ring", category: "Best Sellers", price: "LKR 295,000",
    description: "Classic 0.5ct solitaire in 18K gold",
    image: "/assets/images/SJ r12.png", tag: "BESTSELLER",
    images: [
      "/assets/images/SJ r12.png",
    ],
  },
  {
    id: 32, name: "Mangalsutra Necklace", category: "Wedding Collection", price: "LKR 125,000",
    description: "Modern 22K gold mangalsutra",
    image: "/assets/images/SJ n5.png", tag: "BRIDAL",
    images: [
      "/assets/images/SJ n5.png",
    ],
  },
];

const allProducts: Product[] = [...goldProducts, ...silverProducts, ...gemProducts, ...curatedProducts];

const getProducts = (tab: CollectionTab): Product[] => {
  switch (tab) {
    case "gold": return goldProducts;
    case "silver": return silverProducts;
    case "gem": return gemProducts;
    case "curated": return curatedProducts;
  }
};

const getSubcategories = (tab: CollectionTab): string[] => {
  switch (tab) {
    case "gold": return goldSubcategories;
    case "silver": return silverSubcategories;
    case "gem": return ["All", "Sapphires", "Rubies", "Emeralds", "Moonstone", "Amethyst", "Topaz"];
    case "curated": return curatedSubcategories;
  }
};

const tagColors: Record<string, string> = {
  NEW: "bg-emerald-500", BESTSELLER: "bg-amber-500", LIMITED: "bg-red-500",
  BRIDAL: "bg-pink-500", DAILY: "bg-blue-500", Premium: "bg-indigo-500",
  Rare: "bg-rose-500", Exclusive: "bg-emerald-600", "Ultra Rare": "bg-orange-500",
  Collector: "bg-purple-500", "Museum Grade": "bg-violet-500",
};

export function Collections() {
  const [activeTab, setActiveTab] = useState<CollectionTab>("gold");
  const [activeSubcategory, setActiveSubcategory] = useState("All");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightFilter, setHighlightFilter] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { ref, isVisible } = useInView(0.1);
  const filterRef = useRef<HTMLDivElement>(null);

  // Listen for navigation events from Navbar
  useEffect(() => {
    const unsubscribe = onCollectionNavigate((event) => {
      // Switch to the correct tab
      setActiveTab(event.tab);
      // Switch to the correct subcategory
      setActiveSubcategory(event.subcategory);

      // Flash the subcategory filter to draw attention
      setHighlightFilter(true);
      setTimeout(() => setHighlightFilter(false), 1500);
    });
    return unsubscribe;
  }, []);

  const products = getProducts(activeTab);
  const subcategories = getSubcategories(activeTab);
  const filteredProducts = activeSubcategory === "All" ? products : products.filter((p) => p.category === activeSubcategory);

  const handleTabChange = (tab: CollectionTab) => {
    setActiveTab(tab);
    setActiveSubcategory("All");
  };

  const openProductModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const closeProductModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  }, []);

  const navigateProduct = useCallback((direction: "next" | "prev") => {
    if (!selectedProduct) return;
    const currentIndex = filteredProducts.findIndex((p) => p.id === selectedProduct.id);
    if (currentIndex === -1) return;
    const newIndex = direction === "next"
      ? (currentIndex + 1) % filteredProducts.length
      : (currentIndex - 1 + filteredProducts.length) % filteredProducts.length;
    setSelectedProduct(filteredProducts[newIndex]);
  }, [selectedProduct, filteredProducts]);

  const handleSelectRelatedProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  return (
    <section id="collections" className={`py-24 relative overflow-hidden ${isDark ? "bg-[#0f0a06]" : "bg-white"}`}>
      <div className={`absolute top-0 left-0 w-full h-[2px] ${isDark ? "gold-gradient" : "bg-gradient-to-r from-transparent via-gold-300 to-transparent"}`} />
      <div className={`absolute -top-32 -right-32 w-80 h-80 ${isDark ? "bg-gold-400/5" : "bg-gold-100/40"} rounded-full blur-[100px]`} />
      <div className={`absolute -bottom-32 -left-32 w-80 h-80 ${isDark ? "bg-gold-400/5" : "bg-gold-100/40"} rounded-full blur-[100px]`} />

      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative scroll-reveal ${isVisible ? "visible" : ""}`}>
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-[1px] bg-gold-400" />
            <Sparkles className="w-5 h-5 text-gold-400" />
            <div className="w-16 h-[1px] bg-gold-400" />
          </div>
          <h2 className={`font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold ${isDark ? "text-white" : "text-dark-brown"} mb-4`}>
            Our <span className="gold-text-gradient italic">Collections</span>
          </h2>
          <p className={`font-cormorant text-xl ${isDark ? "text-white/50" : "text-dark-brown/50"} max-w-2xl mx-auto italic`}>
            Discover our exquisite range of handcrafted jewellery, each piece a testament to artistry
          </p>
        </div>

        {/* Main Category Tabs */}
        <div className={`flex flex-wrap justify-center gap-3 mb-8 transition-all duration-500 ${highlightFilter ? "scale-[1.02]" : ""}`}>
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`group flex items-center gap-2.5 px-5 sm:px-7 py-3.5 rounded-full text-sm font-montserrat tracking-wide transition-all duration-400 border ${
                activeTab === tab.key
                  ? "gold-gradient-animated text-dark-brown font-semibold shadow-lg shadow-gold-400/20 border-transparent scale-105"
                  : isDark
                    ? "bg-white/5 text-white/60 hover:text-white border-gold-400/15 hover:border-gold-400/40 hover:shadow-md"
                    : "bg-white text-dark-brown/60 hover:text-dark-brown border-gold-200/60 hover:border-gold-400/40 hover:shadow-md shadow-sm"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Tab Description */}
        <div className="text-center mb-8">
          <p className={`font-montserrat text-sm ${isDark ? "text-white/30" : "text-dark-brown/40"} flex items-center justify-center gap-2`}>
            <Crown className="w-4 h-4 text-gold-400" />
            {tabConfig.find((t) => t.key === activeTab)?.description}
          </p>
        </div>

        {/* Subcategory Filter */}
        <div ref={filterRef} className={`flex flex-wrap justify-center gap-2 mb-14 transition-all duration-500 ${highlightFilter ? "ring-2 ring-gold-400/50 ring-offset-4 rounded-2xl p-3 shadow-lg shadow-gold-400/10" : ""} ${isDark && highlightFilter ? "ring-offset-[#0f0a06]" : highlightFilter ? "ring-offset-white" : ""}`}>
          {subcategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveSubcategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-montserrat tracking-wider uppercase transition-all duration-300 ${
                activeSubcategory === cat
                  ? isDark ? "bg-gold-400 text-dark-brown font-semibold shadow-md shadow-gold-400/20" : "bg-dark-brown text-gold-400 font-semibold shadow-md"
                  : isDark ? "bg-white/5 text-white/40 hover:text-white/70 border border-gold-400/10 hover:border-gold-400/30" : "bg-gray-50 text-dark-brown/50 hover:text-dark-brown border border-gold-200/50 hover:border-gold-400/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`group rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer ${
                isDark
                  ? "bg-white/5 border border-gold-400/10 hover:border-gold-400/30 hover:shadow-xl hover:shadow-gold-400/5"
                  : "bg-white border border-gray-100 hover:border-gold-300/50 hover:shadow-2xl hover:shadow-gold-200/30"
              } ${hoveredId === product.id ? "scale-[1.02]" : ""}`}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => openProductModal(product)}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                {/* Overlay buttons */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                    onClick={(e) => { e.stopPropagation(); openProductModal(product); }}
                  >
                    <Eye className="w-5 h-5 text-dark-brown" />
                  </button>
                  <button
                    className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                    onClick={(e) => { e.stopPropagation(); }}
                  >
                    <Heart className="w-5 h-5 text-dark-brown" />
                  </button>
                </div>

                {/* Price */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                  <span className="text-xs font-montserrat font-bold text-dark-brown">{product.price}</span>
                </div>

                {/* Tag */}
                {product.tag && (
                  <div className={`absolute top-3 left-3 ${tagColors[product.tag] || "bg-gold-500"} px-3 py-1 rounded-full shadow-md`}>
                    <span className="text-[10px] font-montserrat font-bold text-white tracking-wider uppercase">{product.tag}</span>
                  </div>
                )}

                {/* Image count badge */}
                {product.images.length > 1 && (
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <Eye className="w-3 h-3 text-white/80" />
                    <span className="text-[10px] font-montserrat text-white/80">{product.images.length} photos</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <span className={`text-[10px] font-montserrat tracking-[0.2em] uppercase ${isDark ? "text-gold-400/70" : "text-gold-500"} font-medium`}>
                  {product.category}
                </span>
                <h3 className={`font-playfair text-lg font-semibold ${isDark ? "text-white group-hover:text-gold-300" : "text-dark-brown group-hover:text-gold-600"} mt-1 mb-2 transition-colors`}>
                  {product.name}
                </h3>
                <p className={`text-sm ${isDark ? "text-white/40" : "text-dark-brown/50"} font-montserrat leading-relaxed`}>
                  {product.description}
                </p>

                {/* Quick View Button */}
                <button className={`mt-3 w-full py-2.5 rounded-xl text-xs font-montserrat tracking-widest uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  isDark
                    ? "bg-gold-400/10 text-gold-400 hover:bg-gold-400/20 border border-gold-400/20"
                    : "bg-gold-50 text-gold-600 hover:bg-gold-100 border border-gold-200/50"
                }`}
                onClick={(e) => { e.stopPropagation(); openProductModal(product); }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Quick View
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Search className={`w-12 h-12 mx-auto mb-4 ${isDark ? "text-white/20" : "text-dark-brown/20"}`} />
            <h3 className={`font-playfair text-xl ${isDark ? "text-white/60" : "text-dark-brown/60"} mb-2`}>No products found</h3>
            <p className={`font-montserrat text-sm ${isDark ? "text-white/30" : "text-dark-brown/40"}`}>Try selecting a different category</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="#contact"
            className={`inline-flex items-center gap-2 px-10 py-4 border-2 border-gold-400 font-montserrat text-sm tracking-widest uppercase font-semibold rounded-full transition-all duration-300 group hover:gold-gradient hover:text-dark-brown hover:border-transparent hover:shadow-lg hover:shadow-gold-400/20 hover:scale-105 ${isDark ? "text-gold-400" : "text-gold-600"}`}
          >
            Visit Store for More
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
        onNext={() => navigateProduct("next")}
        onPrev={() => navigateProduct("prev")}
        allProducts={allProducts}
        onSelectProduct={handleSelectRelatedProduct}
      />
    </section>
  );
}
