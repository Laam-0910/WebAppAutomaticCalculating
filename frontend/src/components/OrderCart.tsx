import React, { useState } from 'react';
import { CartItem } from '../types';
import { ShoppingBag, Trash2, Tag, User, QrCode, Banknote, Edit3 } from 'lucide-react';
import { QuantityStepper } from './QuantityStepper';

interface OrderCartProps {
  cartItems: CartItem[];
  customerName: string;
  setCustomerName: (name: string) => void;
  discount: number;
  setDiscount: (discount: number) => void;
  subtotal: number;
  totalAmount: number;
  totalItemCount: number;
  loading: boolean;
  onUpdateQuantity: (menuItemId: number, quantity: number) => void;
  onUpdateNote: (menuItemId: number, note: string) => void;
  onRemoveFromCart: (menuItemId: number) => void;
  onClearCart: () => void;
  onCheckout: (method: 'CASH' | 'BANKING') => void;
}

export const OrderCart: React.FC<OrderCartProps> = ({
  cartItems,
  customerName,
  setCustomerName,
  discount,
  setDiscount,
  subtotal,
  totalAmount,
  totalItemCount,
  loading,
  onUpdateQuantity,
  onUpdateNote,
  onRemoveFromCart,
  onClearCart,
  onCheckout,
}) => {
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [discountInput, setDiscountInput] = useState<string>(discount ? String(discount) : '');

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  const handleDiscountChange = (val: string) => {
    setDiscountInput(val);
    const num = parseInt(val.replace(/\D/g, ''), 10) || 0;
    setDiscount(num);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-violet-400 shadow-lg overflow-hidden flex flex-col">
      {/* Header Giỏ hàng thu gọn */}
      <div className="bg-violet-900 text-white px-3.5 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-violet-300" />
          <h2 className="font-black text-senior-base tracking-tight">GIỎ HÀNG THANH TOÁN</h2>
        </div>
        {totalItemCount > 0 && (
          <span className="bg-violet-500 text-white text-senior-xs font-black px-2.5 py-0.5 rounded-full shadow-inner border border-violet-300">
            {totalItemCount} món
          </span>
        )}
      </div>

      {/* Danh sách món đã chọn - Cuộn mượt gọn gàng */}
      <div className="p-3 flex-1 min-h-[180px] max-h-[300px] overflow-y-auto space-y-2.5 divide-y divide-gray-100">
        {cartItems.length === 0 ? (
          <div className="h-full py-8 flex flex-col items-center justify-center text-gray-400 text-center">
            <ShoppingBag className="w-10 h-10 mb-2 text-gray-300 stroke-[1.5]" />
            <p className="font-black text-senior-base text-gray-500">Giỏ hàng đang trống!</p>
            <p className="text-senior-xs text-gray-400 mt-0.5 font-bold">Vui lòng chọn món bên danh sách thực đơn.</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.menuItem.id} className="pt-2.5 first:pt-0 space-y-1.5">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-senior-sm text-gray-900 leading-tight truncate">
                    {item.menuItem.name}
                  </h4>
                  <p className="text-senior-xs font-bold text-sky-800">
                    {formatVND(item.menuItem.price)} / {item.menuItem.unit || 'Phần'}
                  </p>
                </div>
                <span className="font-black text-senior-sm text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 whitespace-nowrap">
                  {formatVND(item.menuItem.price * item.quantity)}
                </span>
              </div>

              {/* Ghi chú món ăn */}
              <div className="flex items-center gap-1.5">
                {editingNoteId === item.menuItem.id ? (
                  <input
                    type="text"
                    placeholder="Ghi chú (ví dụ: cay, ít ngọt...)"
                    value={item.note || ''}
                    onChange={(e) => onUpdateNote(item.menuItem.id, e.target.value)}
                    onBlur={() => setEditingNoteId(null)}
                    autoFocus
                    className="flex-1 px-2 py-1 text-senior-xs border border-sky-400 rounded-lg font-bold text-gray-800 bg-sky-50 focus:outline-none h-7"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditingNoteId(item.menuItem.id)}
                    className="text-[11px] font-bold text-gray-500 hover:text-sky-700 flex items-center gap-1 bg-gray-100 hover:bg-sky-50 px-2 py-0.5 rounded-md border border-gray-200 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    {item.note ? `📝 ${item.note}` : '+ Thêm ghi chú'}
                  </button>
                )}
              </div>

              {/* Bộ chỉnh số lượng & Nút xóa món */}
              <div className="flex justify-between items-center pt-0.5">
                <QuantityStepper
                  quantity={item.quantity}
                  onIncrease={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)}
                  onDecrease={() => onUpdateQuantity(item.menuItem.id, item.quantity - 1)}
                  onRemove={() => onRemoveFromCart(item.menuItem.id)}
                  size="small"
                />
                <button
                  type="button"
                  onClick={() => onRemoveFromCart(item.menuItem.id)}
                  className="text-[11px] font-bold text-red-600 hover:text-red-800 px-2 py-0.5 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 transition-all cursor-pointer"
                >
                  Xóa món
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Thông tin đơn hàng & Nút thanh toán thu gọn */}
      {cartItems.length > 0 && (
        <div className="p-3 bg-gray-50 border-t-2 border-gray-200 space-y-2.5">
          {/* Ô nhập thông tin khách hàng & Giảm giá xếp ngang thu gọn */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-black text-gray-700 text-senior-xs mb-0.5 truncate flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-gray-500" /> Tên khách:
              </label>
              <input
                type="text"
                placeholder="Nhập tên khách..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-2.5 py-1 border border-gray-300 rounded-lg text-senior-xs text-gray-900 font-bold bg-white focus:outline-none focus:border-sky-600 h-8"
              />
            </div>

            <div>
              <label className="block font-black text-gray-700 text-senior-xs mb-0.5 truncate flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-gray-500" /> Giảm giá:
              </label>
              <input
                type="text"
                placeholder="0 đ"
                value={discountInput}
                onChange={(e) => handleDiscountChange(e.target.value)}
                className="w-full px-2.5 py-1 border border-gray-300 rounded-lg text-senior-xs text-gray-900 font-bold bg-white focus:outline-none focus:border-sky-600 text-right h-8"
              />
            </div>
          </div>

          {/* Bảng tính tổng tiền gọn gàng */}
          <div className="bg-white p-2.5 rounded-xl border border-sky-300 space-y-1 shadow-2xs">
            <div className="flex justify-between text-senior-xs text-gray-600">
              <span>Tạm tính ({totalItemCount} món):</span>
              <span className="font-bold text-gray-900">{formatVND(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-senior-xs text-red-600">
                <span>Giảm giá:</span>
                <span className="font-bold">- {formatVND(discount)}</span>
              </div>
            )}

            <div className="pt-1 border-t border-gray-200 flex justify-between items-center">
              <span className="text-senior-base font-black text-gray-900">TỔNG TIỀN:</span>
              <span className="text-senior-lg font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-400">
                {formatVND(totalAmount)}
              </span>
            </div>
          </div>

          {/* 2 NÚT THANH TOÁN (QUÉT QR & TIỀN MẶT) GỌN GÀNG VỪA KHỦNG DỄ BẤM */}
          <div className="space-y-1.5 pt-0.5">
            <div className="grid grid-cols-2 gap-2">
              {/* Nút QUÉT MÃ QR */}
              <button
                type="button"
                disabled={loading || cartItems.length === 0}
                onClick={() => onCheckout('BANKING')}
                className="py-2.5 px-2 bg-gradient-to-br from-sky-700 to-sky-900 hover:from-sky-800 hover:to-sky-950 active:scale-[0.96] text-white font-black rounded-xl shadow-md border border-sky-400 flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer disabled:opacity-40"
              >
                <div className="flex items-center gap-1.5">
                  <QrCode className="w-5 h-5 text-sky-300" strokeWidth={2.5} />
                  <span className="text-senior-sm font-black leading-none">QUÉT MÃ QR</span>
                </div>
                <span className="text-[10px] bg-sky-950/80 text-sky-200 px-1.5 py-0.2 rounded-full font-bold">Chuyển khoản</span>
              </button>

              {/* Nút TIỀN MẶT */}
              <button
                type="button"
                disabled={loading || cartItems.length === 0}
                onClick={() => onCheckout('CASH')}
                className="py-2.5 px-2 bg-gradient-to-br from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 active:scale-[0.96] text-white font-black rounded-xl shadow-md border border-emerald-400 flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer disabled:opacity-40"
              >
                <div className="flex items-center gap-1.5">
                  <Banknote className="w-5 h-5 text-emerald-300" strokeWidth={2.5} />
                  <span className="text-senior-sm font-black leading-none">TIỀN MẶT</span>
                </div>
                <span className="text-[10px] bg-emerald-950/80 text-emerald-200 px-1.5 py-0.2 rounded-full font-bold">Thu tiền mặt</span>
              </button>
            </div>

            {/* Nút xóa toàn bộ giỏ hàng */}
            <button
              type="button"
              onClick={onClearCart}
              className="w-full py-1.5 px-3 bg-gray-200 hover:bg-red-100 hover:text-red-700 text-gray-700 font-extrabold text-senior-xs rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-gray-300"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa toàn bộ giỏ hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

