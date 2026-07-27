import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Plus, Check, Utensils, Edit2 } from 'lucide-react';
import { QuantityStepper } from './QuantityStepper';

interface MenuItemCardProps {
  item: MenuItem;
  quantityInCart: number;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (menuItemId: number, quantity: number) => void;
  onUpdatePrice?: (menuItemId: number, newPrice: number) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onUpdatePrice,
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const [isEditingPrice, setIsEditingPrice] = useState<boolean>(false);
  const [priceInput, setPriceInput] = useState<string>(String(item.price));

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  const handleSavePrice = () => {
    const num = parseInt(priceInput.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num >= 0 && onUpdatePrice) {
      onUpdatePrice(item.id, num);
    }
    setIsEditingPrice(false);
  };

  return (
    <div className={`bg-white rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all shadow-xs hover:shadow-md flex flex-col justify-between h-full ${
      quantityInCart > 0 ? 'border-sky-600 bg-sky-50/50 ring-2 ring-sky-300' : 'border-gray-200 hover:border-sky-400'
    }`}>
      {/* Khung chứa ảnh sản phẩm — Bấm vào ảnh để thêm món nhanh */}
      <div
        className={`relative h-20 sm:h-28 w-full bg-[#FFFDF7] flex items-center justify-center p-1 border-b border-gray-100 overflow-hidden cursor-pointer select-none active:brightness-90 transition-all ${!isEditingPrice ? 'active:scale-[0.97]' : ''}`}
        onClick={() => {
          if (isEditingPrice) return;
          if (quantityInCart > 0) {
            onUpdateQuantity(item.id, quantityInCart + 1);
          } else {
            onAddToCart(item);
          }
        }}
        title="Bấm vào ảnh để thêm món nhanh"
      >
        {item.imageUrl && !imageError ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            onError={() => setImageError(true)}
            className="max-h-[92%] max-w-[92%] object-contain transition-transform duration-200 hover:scale-105 pointer-events-none"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-1 text-center pointer-events-none">
            <Utensils className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300 stroke-[1.5]" />
            <span className="text-[11px] sm:text-senior-xs font-bold text-gray-400 line-clamp-1">{item.name}</span>
          </div>
        )}

        {/* Badge số lượng đã chọn */}
        {quantityInCart > 0 && (
          <div className="absolute top-1 right-1 z-10">
            <span className="flex items-center gap-0.5 text-white bg-emerald-600 font-black text-[11px] sm:text-senior-xs px-1.5 py-0.5 rounded-md shadow-sm border border-emerald-400">
              <Check className="w-3 h-3 stroke-[3]" /> {quantityInCart}
            </span>
          </div>
        )}

        {/* Flash hint "Bấm để thêm" khi chưa có trong giỏ */}
        {quantityInCart === 0 && !isEditingPrice && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/30 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full opacity-60 pointer-events-none">
            Bấm để thêm
          </div>
        )}
      </div>


      {/* Thông tin món ăn & Chỉnh sửa giá trực tiếp */}
      <div className="p-1.5 sm:p-2.5 flex-1 flex flex-col justify-between space-y-1 sm:space-y-2">
        <div>
          <h3 className="font-black text-gray-900 text-senior-xs sm:text-senior-sm leading-tight line-clamp-2 min-h-[1.9rem] sm:min-h-[2.4rem] flex items-center" title={item.name}>
            {item.name}
          </h3>

          {/* Giá tiền & Nút đổi giá món ăn */}
          <div className="mt-1 flex items-center justify-between flex-wrap gap-0.5">
            {isEditingPrice ? (
              <div className="flex flex-col gap-1 w-full bg-white p-1.5 rounded-lg border-2 border-sky-400 shadow-xs z-10">
                <input
                  type="text"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSavePrice()}
                  autoFocus
                  className="w-full px-2 py-1 text-senior-sm font-black border border-sky-400 rounded bg-sky-50 text-sky-900 focus:outline-none text-center"
                />
                <button
                  type="button"
                  onClick={handleSavePrice}
                  className="w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-senior-xs rounded cursor-pointer shadow-2xs"
                >
                  ✓ Lưu giá
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 group">
                <span className="text-senior-sm sm:text-senior-base font-black text-sky-900 leading-none">
                  {formatVND(item.price)}
                </span>
                {onUpdatePrice && (
                  <button
                    type="button"
                    onClick={() => setIsEditingPrice(true)}
                    className="p-0.5 text-gray-400 hover:text-sky-700 rounded cursor-pointer transition-colors"
                    title="Bấm để sửa giá món này"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {item.unit && !isEditingPrice && (
              <span className="text-[10px] sm:text-senior-xs font-black text-red-600 bg-red-50 px-1 py-0.2 rounded border border-red-200">
                /{item.unit}
              </span>
            )}
          </div>
        </div>

        <div className="pt-0.5">
          {quantityInCart > 0 ? (
            <div className="flex items-center justify-center bg-white p-0.5 rounded-lg border border-sky-300">
              <QuantityStepper
                quantity={quantityInCart}
                onIncrease={() => onUpdateQuantity(item.id, quantityInCart + 1)}
                onDecrease={() => onUpdateQuantity(item.id, quantityInCart - 1)}
                onRemove={() => onUpdateQuantity(item.id, 0)}
                size="small"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart(item)}
              className="w-full py-1.5 sm:py-2 px-1.5 bg-sky-700 hover:bg-sky-800 active:scale-[0.96] text-white font-black text-senior-xs sm:text-senior-sm rounded-lg sm:rounded-xl shadow-xs flex items-center justify-center gap-1 transition-all cursor-pointer border border-sky-600"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              THÊM
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


