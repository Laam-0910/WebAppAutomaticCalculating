import React from 'react';
import { X, Bell, ShieldAlert, CheckCircle2, Settings, Smartphone } from 'lucide-react';

interface NotificationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationGuideModal: React.FC<NotificationGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOpenAndroidSettings = () => {
    try {
      if (typeof (window as any).AndroidNativeTTS !== 'undefined') {
        // Có thể gọi bridge native mở Cài Đặt
      }
      alert('Vui lòng vào Cài đặt -> Quyền truy cập thông báo -> Tắt đi gạt Bật lại ứng dụng Sushi Shop!');
    } catch {
      alert('Vui lòng vào Cài đặt -> Quyền truy cập thông báo -> Tắt đi gạt Bật lại ứng dụng Sushi Shop!');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-900/70 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-2 border-sky-400 my-auto flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="bg-sky-900 text-white p-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-amber-300 animate-bounce" />
            <div>
              <h2 className="font-black text-senior-base leading-tight">
                CÁCH BẬT QUYỀN ĐỌC THÔNG BÁO MBBANK
              </h2>
              <p className="text-[11px] text-sky-200 font-bold">
                (Thao tác 3 bước đơn giản trên điện thoại Android)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung hướng dẫn từng bước */}
        <div className="p-3.5 space-y-3 overflow-y-auto">
          
          {/* Cảnh báo cài đặt bị hạn chế */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 space-y-1">
            <div className="flex items-center gap-2 text-amber-900 font-black text-senior-xs">
              <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>NẾU HIỆN "CÀI ĐẶT BỊ HẠN CHẾ":</span>
            </div>
            <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
              Do app được cài từ tệp APK, Android 13/14/15 sẽ tạm thời khóa công tắc. Bạn chỉ cần thực hiện 3 bước dưới đây để gỡ khóa trong 5 giây!
            </p>
          </div>

          {/* 3 Bước hướng dẫn chi tiết */}
          <div className="space-y-2.5">
            
            {/* Bước 1 */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 flex items-start gap-3">
              <div className="w-7 h-7 bg-sky-600 text-white rounded-full flex items-center justify-center font-black text-senior-xs flex-shrink-0 shadow-xs">
                1
              </div>
              <div className="space-y-0.5">
                <p className="font-black text-senior-xs text-sky-950 flex items-center gap-1">
                  <Smartphone className="w-4 h-4 text-sky-600" /> Nhấn giữ 2 giây biểu tượng App Sushi Shop
                </p>
                <p className="text-[11px] text-gray-600 font-bold">
                  Ra màn hình chính ➔ Nhấn giữ biểu tượng App ➔ Chọn dòng <span className="font-black text-sky-900 bg-sky-100 px-1 py-0.2 rounded">ⓘ Thông tin ứng dụng</span>.
                </p>
              </div>
            </div>

            {/* Bước 2 */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 flex items-start gap-3">
              <div className="w-7 h-7 bg-sky-600 text-white rounded-full flex items-center justify-center font-black text-senior-xs flex-shrink-0 shadow-xs">
                2
              </div>
              <div className="space-y-0.5">
                <p className="font-black text-senior-xs text-sky-950 flex items-center gap-1">
                  <Settings className="w-4 h-4 text-sky-600" /> Bấm Dấu 3 Chấm (⋮) góc trên bên phải
                </p>
                <p className="text-[11px] text-gray-600 font-bold">
                  Bấm dấu 3 chấm <span className="font-black text-sky-900 bg-sky-100 px-1 py-0.2 rounded">⋮</span> ở góc trên cùng bên phải ➔ Chọn dòng <span className="font-black text-emerald-800 bg-emerald-100 px-1 py-0.2 rounded">Cho phép cài đặt bị hạn chế</span>.
                </p>
              </div>
            </div>

            {/* Bước 3 */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 flex items-start gap-3">
              <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-senior-xs flex-shrink-0 shadow-xs">
                3
              </div>
              <div className="space-y-0.5">
                <p className="font-black text-senior-xs text-emerald-950 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Gạt Bật Công Tắc Cho Phép Sushi Shop
                </p>
                <p className="text-[11px] text-gray-600 font-bold">
                  Vào <span className="font-black text-emerald-900 bg-emerald-100 px-1 py-0.2 rounded">Cài đặt ➔ Quyền truy cập thông báo</span> ➔ Gạt công tắc cho phép <span className="font-black text-emerald-900">Sushi Shop</span> là xong!
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Nút bấm mở nhanh cài đặt */}
        <div className="p-3 bg-white border-t border-gray-200 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleOpenAndroidSettings}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-sky-600 to-sky-800 hover:from-sky-700 hover:to-sky-900 text-white font-black text-senior-xs sm:text-senior-sm rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Settings className="w-4 h-4 text-amber-300" />
            ⚙️ MỞ CÀI ĐẶT QUYỀN THÔNG BÁO TẠI ĐÂY
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-extrabold text-senior-xs rounded-xl cursor-pointer text-center"
          >
            Đã Hiểu - Đóng Hướng Dẫn
          </button>
        </div>

      </div>
    </div>
  );
};
