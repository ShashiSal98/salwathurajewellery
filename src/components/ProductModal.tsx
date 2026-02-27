import { useState, useEffect, useCallback } from "react";
import {
  X, Heart, Share2, ShoppingBag, ChevronLeft, ChevronRight,
  Star, Shield, Truck, RotateCcw, Gem, Ruler, Weight,
  Award, MessageCircle, ZoomIn, Check, Sparkles, Camera
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  images: string[];
  tag?: string;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  allProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
}

const productDetails: Record<string, { material: string; weight: string; purity: string; size: string; origin: string }> = {
  gold: { material: "22K / 18K Gold", weight: "8g - 45g", purity: "916 / 750 Hallmarked", size: "Adjustable", origin: "Sri Lanka" },
  silver: { material: "925 Sterling Silver", weight: "5g - 30g", purity: "925 Certified", size: "Adjustable", origin: "Sri Lanka" },
  gem: { material: "18K Gold + Gemstone", weight: "4g - 20g", purity: "Certified Gems", size: "Custom", origin: "Ceylon (Sri Lanka)" },
  curated: { material: "18K / 22K Gold", weight: "6g - 50g", purity: "Hallmarked", size: "Various", origin: "Sri Lanka" },
};

const reviews = [
  { name: "Amaya P.", rating: 5, text: "Absolutely stunning piece! The craftsmanship is exceptional.", date: "2 weeks ago" },
  { name: "Kasun D.", rating: 5, text: "Perfect gift for my wife. She loved it!", date: "1 month ago" },
  { name: "Nimesha S.", rating: 4, text: "Beautiful design, exactly as shown in the picture.", date: "3 weeks ago" },
];

export function ProductModal({ product, isOpen, onClose, onNext, onPrev, allProducts, onSelectProduct }: ProductModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "reviews" | "shipping">("details");
  const [isAnimating, setIsAnimating] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setActiveImageIndex(0);
      setIsZoomed(false);
      setActiveTab("details");
      setQuantity(1);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, product]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowRight") onNext?.();
    if (e.key === "ArrowLeft") onPrev?.();
  }, [isOpen, onClose, onNext, onPrev]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // Use the product's own images array
  const images = product?.images && product.images.length > 0
    ? product.images
    : product
      ? [product.image]
      : [];

  const getType = (): string => {
    if (!product) return "gold";
    const cat = product.category;
    if (cat === "Sapphires" || cat === "Rubies" || cat === "Emeralds" || cat === "Moonstone" || cat === "Amethyst" || cat === "Topaz") return "gem";
    if (cat === "New Arrivals" || cat === "Best Sellers" || cat === "Limited Edition" || cat === "Wedding Collection" || cat === "Everyday Essentials") return "curated";
    if (product.price.includes("LKR 3,") || product.price.includes("LKR 4,") || product.price.includes("LKR 6,") || product.price.includes("LKR 8,") || product.price.includes("LKR 12,") || product.price.includes("LKR 15,") || product.price.includes("LKR 18,") || product.price.includes("LKR 22,")) return "silver";
    return "gold";
  };

  // Get related products from allProducts (same collection type, excluding current)
  const getRelatedProducts = (): Product[] => {
    if (!product || !allProducts || allProducts.length === 0) return [];
    const currentType = getType();
    const related = allProducts.filter(p => {
      if (p.id === product.id) return false;
      // Check if same type
      const pCat = p.category;
      if (currentType === "gem") {
        return pCat === "Sapphires" || pCat === "Rubies" || pCat === "Emeralds" || pCat === "Moonstone" || pCat === "Amethyst" || pCat === "Topaz";
      }
      if (currentType === "curated") {
        return pCat === "New Arrivals" || pCat === "Best Sellers" || pCat === "Limited Edition" || pCat === "Wedding Collection" || pCat === "Everyday Essentials";
      }
      if (currentType === "silver") {
        return p.price.includes("LKR 3,") || p.price.includes("LKR 4,") || p.price.includes("LKR 6,") || p.price.includes("LKR 8,") || p.price.includes("LKR 12,") || p.price.includes("LKR 15,") || p.price.includes("LKR 18,") || p.price.includes("LKR 22,");
      }
      // gold — check not in other categories
      const isGem = pCat === "Sapphires" || pCat === "Rubies" || pCat === "Emeralds" || pCat === "Moonstone" || pCat === "Amethyst" || pCat === "Topaz";
      const isCurated = pCat === "New Arrivals" || pCat === "Best Sellers" || pCat === "Limited Edition" || pCat === "Wedding Collection" || pCat === "Everyday Essentials";
      const isSilver = p.price.includes("LKR 3,") || p.price.includes("LKR 4,") || p.price.includes("LKR 6,") || p.price.includes("LKR 8,") || p.price.includes("LKR 12,") || p.price.includes("LKR 15,") || p.price.includes("LKR 18,") || p.price.includes("LKR 22,");
      return !isGem && !isCurated && !isSilver;
    });
    // Shuffle and take up to 4
    const shuffled = [...related].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  };

  const relatedProducts = getRelatedProducts();
  const details = productDetails[getType()];

  if (!isOpen || !product) return null;

  const tagColors: Record<string, string> = {
    NEW: "bg-emerald-500", BESTSELLER: "bg-amber-500", LIMITED: "bg-red-500",
    BRIDAL: "bg-pink-500", DAILY: "bg-blue-500", Premium: "bg-indigo-500",
    Rare: "bg-rose-500", Exclusive: "bg-emerald-600", "Ultra Rare": "bg-orange-500",
    Collector: "bg-purple-500", "Museum Grade": "bg-violet-500",
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 transition-all duration-500 ${isAnimating ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className={`absolute inset-0 ${isDark ? "bg-black/85" : "bg-black/60"} backdrop-blur-md`} />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 ${
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        } ${isDark ? "bg-[#1a1209] border border-gold-400/20" : "bg-white border border-gold-200/50"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className={`flex items-center justify-between px-4 sm:px-6 py-3 border-b ${isDark ? "border-gold-400/10 bg-[#1a1209]/90" : "border-gold-100 bg-white/90"} backdrop-blur-sm sticky top-0 z-10`}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className={`font-montserrat text-xs tracking-[0.2em] uppercase ${isDark ? "text-gold-400/70" : "text-gold-600/70"}`}>
              {product.category}
            </span>
            {product.tag && (
              <span className={`${tagColors[product.tag] || "bg-gold-500"} text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase`}>
                {product.tag}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Nav arrows */}
            {onPrev && (
              <button onClick={onPrev} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${isDark ? "bg-white/10 text-white/60 hover:text-white hover:bg-white/20" : "bg-gray-100 text-gray-500 hover:text-dark-brown hover:bg-gray-200"}`}>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {onNext && (
              <button onClick={onNext} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${isDark ? "bg-white/10 text-white/60 hover:text-white hover:bg-white/20" : "bg-gray-100 text-gray-500 hover:text-dark-brown hover:bg-gray-200"}`}>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <div className={`w-px h-5 mx-1 ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
            <button onClick={onClose} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:rotate-90 ${isDark ? "bg-white/10 text-white/60 hover:text-white hover:bg-red-500/30" : "bg-gray-100 text-gray-500 hover:text-white hover:bg-red-400"}`}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-52px)] custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Image Gallery */}
            <div className={`relative ${isDark ? "bg-[#0f0a06]" : "bg-stone-50"}`}>
              {/* Main Image */}
              <div
                className={`relative aspect-square overflow-hidden cursor-${isZoomed ? "zoom-out" : "zoom-in"} group`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={images[activeImageIndex]}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-700 ${isZoomed ? "scale-150" : "scale-100 group-hover:scale-105"}`}
                />
                {/* Zoom hint */}
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white/80 px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5" />
                  {isZoomed ? "Click to zoom out" : "Click to zoom in"}
                </div>

                {/* Wishlist & Share floating buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
                    className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg ${
                      isWishlisted ? "bg-red-500 text-white" : "bg-white/80 text-gray-600 hover:text-red-500"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleShare(); }}
                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-gold-600 transition-all duration-300 hover:scale-110 shadow-lg relative"
                  >
                    {showCopied ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
                  </button>
                </div>

                {/* Image counter */}
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white/80 px-3 py-1 rounded-full text-xs font-montserrat flex items-center gap-1.5">
                  <Camera className="w-3 h-3" />
                  {activeImageIndex + 1} / {images.length}
                </div>

                {/* Image nav arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i => i > 0 ? i - 1 : images.length - 1); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5 text-dark-brown" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i => i < images.length - 1 ? i + 1 : 0); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5 text-dark-brown" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className={`flex gap-2 p-4 ${isDark ? "bg-[#1a1209]" : "bg-white"}`}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveImageIndex(i); setIsZoomed(false); }}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                      activeImageIndex === i
                        ? "border-gold-400 shadow-lg shadow-gold-400/20 scale-105"
                        : isDark ? "border-white/10 opacity-50 hover:opacity-80" : "border-gray-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                    {activeImageIndex === i && (
                      <div className="absolute inset-0 border-2 border-gold-400 rounded-xl" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Details */}
            <div className={`p-6 sm:p-8 lg:p-10 flex flex-col ${isDark ? "bg-[#1a1209]" : "bg-white"}`}>
              {/* Title & Price */}
              <div className="mb-6">
                <h1 className={`font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold ${isDark ? "text-white" : "text-dark-brown"} leading-tight mb-3`}>
                  {product.name}
                </h1>
                <p className={`font-cormorant text-lg italic ${isDark ? "text-white/50" : "text-dark-brown/50"} mb-4`}>
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 text-gold-400 fill-gold-400" />
                    ))}
                  </div>
                  <span className={`text-sm font-montserrat ${isDark ? "text-white/40" : "text-dark-brown/40"}`}>(4.9 · 128 reviews)</span>
                </div>

                {/* Price */}
                <div className={`flex items-end gap-3 pb-6 border-b ${isDark ? "border-white/10" : "border-gray-100"}`}>
                  <span className="font-playfair text-3xl sm:text-4xl font-bold gold-text-gradient">{product.price}</span>
                  <span className={`text-sm font-montserrat line-through ${isDark ? "text-white/30" : "text-dark-brown/30"} mb-1`}>
                    LKR {(parseInt(product.price.replace(/[^0-9]/g, "")) * 1.15).toLocaleString()}
                  </span>
                  <span className="text-xs font-montserrat font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full mb-1">
                    15% OFF
                  </span>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className={`text-xs font-montserrat tracking-widest uppercase mb-2 block ${isDark ? "text-white/40" : "text-dark-brown/40"}`}>
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center rounded-xl border ${isDark ? "border-white/10" : "border-gray-200"} overflow-hidden`}>
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className={`w-10 h-10 flex items-center justify-center text-lg font-medium transition-colors ${isDark ? "text-white/60 hover:bg-white/10" : "text-dark-brown/60 hover:bg-gray-100"}`}
                    >−</button>
                    <span className={`w-12 h-10 flex items-center justify-center text-sm font-montserrat font-semibold border-x ${isDark ? "text-white border-white/10" : "text-dark-brown border-gray-200"}`}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(10, q + 1))}
                      className={`w-10 h-10 flex items-center justify-center text-lg font-medium transition-colors ${isDark ? "text-white/60 hover:bg-white/10" : "text-dark-brown/60 hover:bg-gray-100"}`}
                    >+</button>
                  </div>
                  <span className={`text-xs font-montserrat ${isDark ? "text-white/30" : "text-dark-brown/30"}`}>In stock</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a
                  href={`https://wa.me/94716286275?text=Hi! I'm interested in ${product.name} (${product.price}). Can you provide more details?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 gold-gradient-animated text-dark-brown font-montserrat text-sm font-semibold tracking-wider uppercase px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold-400/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4" />
                  Inquire on WhatsApp
                </a>
                <button className={`flex-1 border-2 border-gold-400 font-montserrat text-sm font-semibold tracking-wider uppercase px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] ${isDark ? "text-gold-400 hover:bg-gold-400/10" : "text-gold-600 hover:bg-gold-50"}`}>
                  <ShoppingBag className="w-4 h-4" />
                  Reserve Now
                </button>
              </div>

              {/* Tabs */}
              <div className={`border-b mb-6 ${isDark ? "border-white/10" : "border-gray-100"}`}>
                <div className="flex gap-6">
                  {(["details", "reviews", "shipping"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-sm font-montserrat tracking-wider uppercase transition-all duration-300 border-b-2 ${
                        activeTab === tab
                          ? "text-gold-400 border-gold-400 font-semibold"
                          : isDark ? "text-white/40 border-transparent hover:text-white/60" : "text-dark-brown/40 border-transparent hover:text-dark-brown/60"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1">
                {activeTab === "details" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Gem, label: "Material", value: details.material },
                        { icon: Weight, label: "Weight", value: details.weight },
                        { icon: Award, label: "Purity", value: details.purity },
                        { icon: Ruler, label: "Size", value: details.size },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className={`p-3.5 rounded-xl border ${isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-stone-50"}`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <Icon className="w-3.5 h-3.5 text-gold-400" />
                            <span className={`text-[10px] font-montserrat tracking-widest uppercase ${isDark ? "text-white/30" : "text-dark-brown/30"}`}>{label}</span>
                          </div>
                          <span className={`text-sm font-montserrat font-medium ${isDark ? "text-white/80" : "text-dark-brown/80"}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className={`p-4 rounded-xl ${isDark ? "bg-gold-400/5 border border-gold-400/10" : "bg-gold-50/50 border border-gold-200/30"}`}>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className={`text-sm font-montserrat font-semibold ${isDark ? "text-white/80" : "text-dark-brown/80"} mb-1`}>Authenticity Guaranteed</h4>
                          <p className={`text-xs ${isDark ? "text-white/40" : "text-dark-brown/40"} leading-relaxed`}>
                            Every piece comes with a certificate of authenticity, BIS hallmark certification, and a lifetime exchange guarantee.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4 animate-fadeIn">
                    {reviews.map((review, i) => (
                      <div key={i} className={`p-4 rounded-xl border ${isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-stone-50"}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full gold-gradient-animated flex items-center justify-center text-dark-brown text-xs font-bold">
                              {review.name.charAt(0)}
                            </div>
                            <span className={`text-sm font-montserrat font-medium ${isDark ? "text-white/80" : "text-dark-brown/80"}`}>{review.name}</span>
                          </div>
                          <span className={`text-xs font-montserrat ${isDark ? "text-white/30" : "text-dark-brown/30"}`}>{review.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 mb-2">
                          {Array.from({ length: review.rating }).map((_, s) => (
                            <Star key={s} className="w-3 h-3 text-gold-400 fill-gold-400" />
                          ))}
                        </div>
                        <p className={`text-sm ${isDark ? "text-white/50" : "text-dark-brown/50"} font-montserrat leading-relaxed`}>{review.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "shipping" && (
                  <div className="space-y-4 animate-fadeIn">
                    {[
                      { icon: Truck, title: "Islandwide Delivery", desc: "Free delivery across Sri Lanka within 3-5 business days. Express delivery available for Colombo." },
                      { icon: RotateCcw, title: "Easy Returns", desc: "7-day return policy with full refund. Exchange available within 30 days." },
                      { icon: Shield, title: "Secure Packaging", desc: "Premium gift-ready packaging with tamper-proof sealing for safe delivery." },
                    ].map(({ icon: Icon, title, desc }) => (
                      <div key={title} className={`flex items-start gap-4 p-4 rounded-xl border ${isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-stone-50"}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? "bg-gold-400/10" : "bg-gold-50"}`}>
                          <Icon className="w-5 h-5 text-gold-400" />
                        </div>
                        <div>
                          <h4 className={`text-sm font-montserrat font-semibold ${isDark ? "text-white/80" : "text-dark-brown/80"} mb-1`}>{title}</h4>
                          <p className={`text-xs ${isDark ? "text-white/40" : "text-dark-brown/40"} leading-relaxed`}>{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Trust badges */}
              <div className={`mt-6 pt-6 border-t ${isDark ? "border-white/10" : "border-gray-100"}`}>
                <div className="flex items-center justify-center gap-6 flex-wrap">
                  {[
                    { icon: Shield, label: "Certified" },
                    { icon: Truck, label: "Free Delivery" },
                    { icon: RotateCcw, label: "Easy Returns" },
                    { icon: Award, label: "Hallmarked" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${isDark ? "text-gold-400/60" : "text-gold-500/60"}`} />
                      <span className={`text-[10px] font-montserrat tracking-wider uppercase ${isDark ? "text-white/30" : "text-dark-brown/30"}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products (You May Also Like) */}
          {relatedProducts.length > 0 && (
            <div className={`p-6 sm:p-8 border-t ${isDark ? "border-white/10 bg-[#0f0a06]" : "border-gray-100 bg-stone-50"}`}>
              <h3 className={`font-playfair text-xl font-bold ${isDark ? "text-white" : "text-dark-brown"} mb-5 text-center`}>
                You May Also <span className="gold-text-gradient italic">Like</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedProducts.map((rp) => (
                  <div
                    key={rp.id}
                    className={`group rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${isDark ? "border-white/10 bg-white/5 hover:border-gold-400/30" : "border-gray-200 bg-white hover:border-gold-300"}`}
                    onClick={() => {
                      if (onSelectProduct) {
                        onSelectProduct(rp);
                      }
                    }}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-3">
                      <p className={`text-xs font-montserrat font-medium ${isDark ? "text-white/60" : "text-dark-brown/60"} truncate`}>
                        {rp.name}
                      </p>
                      <p className="text-xs font-montserrat font-bold text-gold-500 mt-0.5">
                        {rp.price}
                      </p>
                      {rp.tag && (
                        <span className={`inline-block mt-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white ${tagColors[rp.tag] || "bg-gold-500"}`}>
                          {rp.tag}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
