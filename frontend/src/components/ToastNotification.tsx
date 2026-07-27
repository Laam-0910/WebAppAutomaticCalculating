import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastNotificationProps {
  message: string | null;
  onDone: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ message, onDone }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDone, 400);
      }, 6000); // Hiển thị 6 giây
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-2 left-2 right-2 z-[9999] transition-all duration-300 ease-out ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-95 pointer-events-none'
      }`}
    >
      <div className="max-w-md mx-auto bg-emerald-950 text-white rounded-xl shadow-xl border-2 border-emerald-400 p-2 sm:p-2.5 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 border border-emerald-300">
            <CheckCircle className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black text-emerald-300 uppercase tracking-wider leading-none mb-0.5">
              ✅ THÀNH CÔNG
            </p>
            <p className="text-senior-xs sm:text-senior-sm font-black text-white leading-tight truncate">
              {message}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => { setVisible(false); setTimeout(onDone, 300); }}
          className="p-1 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all cursor-pointer flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
