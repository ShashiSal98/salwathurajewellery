import { FaWhatsapp } from "react-icons/fa";

export function WhatsAppButton() {
  return (
    <a
        href="https://wa.me/94716286275"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:bg-green-600 hover:scale-110 transition-all duration-300 group"
      title="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-7 h-7 text-white" />
      <div className="absolute -top-10 right-0 bg-dark-brown text-white text-xs font-montserrat px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
        Chat with us!
      </div>
    </a>
  );
}
