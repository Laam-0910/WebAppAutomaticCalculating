import React from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PosterModal: React.FC<PosterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl relative my-6">
        <div className="flex items-center justify-between pb-3 border-b-2 border-gray-200 mb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-red-600" />
            <h3 className="font-black text-senior-xl text-gray-900">
              BẢNG MENU THỰC TẾ CỦA CỬA HÀNG
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full font-bold transition-all"
            title="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border-2 border-gray-300 bg-amber-50">
          <img
            src="/icons/menu_poster.png"
            alt="Bảng Menu Gốc Cửa Hàng"
            className="w-full h-auto object-contain max-h-[80vh] mx-auto shadow-md"
          />
        </div>

        <p className="text-center text-senior-base text-gray-600 font-bold mt-4">
          Hình ảnh thiết kế tờ menu gốc chính thức của cửa hàng Horse Billing.
        </p>
      </div>
    </div>
  );
};
