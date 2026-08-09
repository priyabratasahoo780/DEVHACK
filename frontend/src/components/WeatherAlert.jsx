import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function WeatherAlert({ type, title, message }) {
  const getAlertConfig = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />,
          titleColor: 'text-red-900'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />,
          titleColor: 'text-yellow-900'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: <Info className="w-5 h-5 text-blue-600 mt-0.5" />,
          titleColor: 'text-blue-900'
        };
    }
  };

  const config = getAlertConfig();

  return (
    <div className={`${config.bg} border ${config.border} p-5 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex-shrink-0">{config.icon}</div>
      <div>
        <h4 className={`font-extrabold ${config.titleColor} mb-1.5 text-lg leading-tight`}>{title}</h4>
        <p className={`${config.text} text-sm font-medium leading-relaxed`}>{message}</p>
      </div>
    </div>
  );
}
