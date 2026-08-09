import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function Error({ message, onRetry }) {
  return (
    <div className="bg-white flex flex-col items-center justify-center py-16 px-6 rounded-2xl border border-red-100 shadow-sm animate-fade-in text-center max-w-lg mx-auto">
      <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Something went wrong!</h3>
      <p className="text-base font-medium text-gray-500 mb-8 max-w-md leading-relaxed">
        {message || 'Could not connect to the server. Please try again in a moment.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 active:scale-95">
          <RefreshCcw className="w-5 h-5" /> Try Again
        </button>
      )}
    </div>
  );
}
