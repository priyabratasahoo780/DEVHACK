import { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export default function UploadBox({ onUpload, onFileSelect, loading }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (f) => {
    setFile(f);
    if (onUpload) onUpload(f);
    if (onFileSelect) onFileSelect(f);
  };

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
          dragActive ? 'border-primary-500 bg-primary-50/50 scale-[1.02]' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-gray-900 font-extrabold text-lg">{file.name}</p>
            <p className="text-sm text-gray-500 font-medium">Auto-analyzing your report via OCR...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-10 h-10 text-primary-600" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-gray-900 mb-2">Upload Your Soil Report</p>
              <p className="text-sm text-gray-500 font-medium">Click to browse or drag & drop your file here</p>
            </div>
            <div className="flex gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mt-2">
              <span className="bg-gray-100 px-3 py-1.5 rounded-md flex items-center gap-1"><FileText className="w-3 h-3" /> PDF</span>
              <span className="bg-gray-100 px-3 py-1.5 rounded-md flex items-center gap-1"><UploadCloud className="w-3 h-3" /> IMAGE</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-start gap-2 bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-100 shadow-sm">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-sm font-semibold">OCR is currently in testing mode. For best results, upload a clear photo or PDF of your soil report.</p>
      </div>
    </div>
  );
}
