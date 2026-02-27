import { FaWhatsapp } from "react-icons/fa";

export function SocialFloatingButtons() {
  return (
    <a
         href="https://wa.me/94716286275"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5b] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 group"
      title="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-7 h-7 text-white" />
      <span className="absolute w-full h-full rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
      {/* Tooltip */}
      <div className="absolute right-16 bg-dark-brown text-white text-xs font-montserrat px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
        Chat with us!
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-dark-brown rotate-45" />
      </div>
    </a>
  );
}
