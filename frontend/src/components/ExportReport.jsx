import { Share2, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExportReport({ title, data, elementId = "report-content" }) {

  const handleWhatsAppShare = () => {
    // Generate a sleek text for WhatsApp
    let textToShare = `*AgriSaar Report: ${title}*\n\n`;
    
    // Simple object traversal for the mock data
    if (data) {
       textToShare += `_AI Advice & Plan:_\n`;
       try {
         const preview = JSON.stringify(data, null, 2).replace(/[{}"]/g, "").trim().slice(0, 500);
         textToShare += preview + '\n\n';
       } catch (e) {
          textToShare += `View your detailed report on the AgriSaar App!\n\n`;
       }
    }
    
    textToShare += `*Download AgriSaar App now for free Smart Farming!*`;
    
    const encoded = encodeURIComponent(textToShare);
    const waUrl = `whatsapp://send?text=${encoded}`;
    
    // fallback if on desktop without whatsapp app
    const webUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    
    try {
      window.location.href = waUrl;
      setTimeout(() => {
        window.open(webUrl, '_blank');
      }, 500);
      toast.success("Opening WhatsApp...");
    } catch(e) {
      window.open(webUrl, '_blank');
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success("Preparing PDF Document...");
  };

  return (
    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto no-print">
      <button 
        onClick={handleWhatsAppShare}
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-transform active:scale-95"
      >
        <Share2 className="w-4 h-4" /> Share on WhatsApp
      </button>
      <button 
        onClick={handlePrint}
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-transform active:scale-95"
      >
        <Download className="w-4 h-4" /> Save PDF / Print
      </button>
    </div>
  );
}
