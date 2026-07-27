import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Invoice } from '../types';
import { X, CheckCircle, Banknote, QrCode, Calculator } from 'lucide-react';

const BANK_CONFIG_KEY = 'sushi_shop_bank_config';
const DEFAULT_BANK = { bankId: '', accountNo: '', accountName: '' };

function getBankConfig() {
  try {
    const s = localStorage.getItem(BANK_CONFIG_KEY) || localStorage.getItem('horse_billing_bank_config');
    return s ? { ...DEFAULT_BANK, ...JSON.parse(s) } : DEFAULT_BANK;
  } catch { return DEFAULT_BANK; }
}

interface PaymentPageProps {
  invoice: Invoice;
  paymentMethod: 'CASH' | 'BANKING';
  onConfirmPayment: (invoice: Invoice) => void;
  onCancel: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({
  invoice,
  paymentMethod,
  onConfirmPayment,
  onCancel,
}) => {
  const bank = getBankConfig();
  const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + ' đ';
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const alreadyFiredRef = useRef(false); // ✅ Dùng ref thay vì state để tránh stale closure

  // Trạng thái tính tiền thừa khi nhận tiền mặt
  const [cashTendered, setCashTendered] = useState<number>(invoice.amount);
  const [cashTenderedInput, setCashTenderedInput] = useState<string>(new Intl.NumberFormat('vi-VN').format(invoice.amount));

  const vietQrUrl = useMemo(() => {
    const addInfo = encodeURIComponent(invoice.invoiceCode || `HD${invoice.id}`);
    return `https://img.vietqr.io/image/${bank.bankId}-${bank.accountNo}-qr_only.jpg?amount=${invoice.amount}&addInfo=${addInfo}`;
  }, [invoice, bank]);

  // 📦 Khi QR screen mở, lưu tên món ăn vào Native để đọc vế 2 hoàn toàn ở Java
  useEffect(() => {
    if (paymentMethod !== 'BANKING') return;
    const itemsText = invoice.order?.items?.map(i => `${i.quantity} ${i.menuItemName}`).join(', ') ?? '';
    if (itemsText && typeof (window as any).AndroidNativeTTS !== 'undefined') {
      try {
        (window as any).AndroidNativeTTS.setCurrentOrder(itemsText);
        console.log('📦 Đã gửi order items sang Native:', itemsText);
      } catch (err) {
        console.warn('setCurrentOrder error:', err);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, invoice.id]);

  // ⚡ LUỒNG QR: BẮT SỰ KIỆN TỰ ĐỘNG TẮT MÀN HÌNH QR
  useEffect(() => {
    if (paymentMethod !== 'BANKING') return;

    const doCloseQR = () => {
      console.log('⚡ Tắt màn hình QR tự động sau khi nhận được thông báo chuyển khoản...');
      setIsProcessing(true);
      // Đóng màn hình QR tự động sau 3 giây (đủ thời gian phát 2 vế Native)
      setTimeout(() => {
        onConfirmPayment(invoice);
      }, 3000);
    };

    // Đăng ký cả 2 cổng lắng nghe: Global Window & EventListener
    (window as any).closeQROrder = doCloseQR;

    const handleAndroidBankEvent = (e: any) => {
      console.log('⚡ Event bank_payment_received kích hoạt doCloseQR');
      doCloseQR();
    };

    window.addEventListener('bank_payment_received', handleAndroidBankEvent);
    return () => {
      delete (window as any).closeQROrder;
      window.removeEventListener('bank_payment_received', handleAndroidBankEvent);
    };
  }, [paymentMethod, invoice, onConfirmPayment]);

  const handleCashTenderedChange = (val: string) => {
    setCashTenderedInput(val);
    const num = parseInt(val.replace(/\D/g, ''), 10) || 0;
    setCashTendered(num);
  };

  const handleConfirm = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    onConfirmPayment(invoice);
  };

  const changeToReturn = cashTendered - invoice.amount;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-2 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl flex flex-col border-2 border-sky-400 my-auto">
        
        {/* Header */}
        <div className={`flex-shrink-0 text-white px-3 py-2 flex items-center justify-between shadow-md ${
          paymentMethod === 'BANKING' ? 'bg-sky-900' : 'bg-emerald-900'
        }`}>
          <div className="flex items-center gap-2">
            {paymentMethod === 'BANKING'
              ? <QrCode className="w-5 h-5 text-amber-300" />
              : <Banknote className="w-5 h-5 text-emerald-300" />}
            <div>
              <h2 className="font-black text-senior-base leading-tight">
                {paymentMethod === 'BANKING' ? 'QUÉT MÃ QR THANH TOÁN' : 'THANH TOÁN TIỀN MẶT'}
              </h2>
              <p className="text-[10px] sm:text-senior-xs text-white/80 font-bold">
                Mã đơn: {invoice.orderCode}
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="p-1 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung chính */}
        <div className="p-2 sm:p-3 space-y-2 overflow-y-auto max-h-[75vh]">
          
          {/* 🔵 GIAO DIỆN QR */}
          {paymentMethod === 'BANKING' ? (
            <div className="space-y-2">
              {/* Trạng thái chờ/nhận tiền */}
              {isProcessing ? (
                <div className="bg-emerald-50 border border-emerald-400 rounded-lg p-1.5 flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <p className="text-[10px] sm:text-senior-xs font-black text-emerald-800">✅ ĐÃ NHẬN TIỀN! Đang chốt đơn...</p>
                </div>
              ) : (
                <div className="bg-sky-50 border border-sky-200 rounded-lg p-1.5 flex items-center justify-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse flex-shrink-0" />
                  <p className="text-[10px] sm:text-senior-xs font-black text-sky-900">
                    📲 Chờ khách chuyển khoản MBBank...
                  </p>
                </div>
              )}

              {/* Mã QR */}
              <div className="bg-white rounded-xl border border-sky-300 p-2 text-center space-y-1 shadow-2xs">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] sm:text-senior-xs font-extrabold text-gray-600">TỔNG TIỀN CẦN CHUYỂN:</span>
                  <span className="text-senior-xl font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.2 rounded-lg border border-emerald-300 mt-0.5">
                    {formatVND(invoice.amount)}
                  </span>
                </div>

                <div className="flex justify-center py-0.5">
                  {bank.bankId && bank.accountNo ? (
                    <div className="p-1.5 bg-white border-2 border-sky-500 rounded-xl shadow-xs">
                      <img
                        src={vietQrUrl}
                        alt="Mã QR VietQR"
                        className="w-40 h-40 sm:w-48 sm:h-48 object-contain rounded"
                      />
                    </div>
                  ) : (
                    <div className="p-6 bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl text-center max-w-xs my-2 space-y-2">
                      <p className="text-senior-sm font-black text-amber-900">⚠️ Chưa cấu hình Ngân hàng</p>
                      <p className="text-[11px] text-amber-800 font-bold leading-tight">
                        Vui lòng nhấn nút <span className="font-black text-gray-900">⚙️ Cài đặt</span> trên màn hình chính để nhập Ngân hàng & STK của bạn.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <p className="text-[10px] text-gray-500 font-bold">
                    Nội dung quét: <span className="font-black text-sky-900">{invoice.invoiceCode || `HD${invoice.id}`}</span>
                  </p>
                </div>
              </div>

              {/* Danh sách món */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-2 space-y-0.5">
                <p className="font-black text-[10px] text-gray-700">📋 DANH SÁCH MÓN ĐÃ ĐẶT ({invoice.order?.items?.length || 0}):</p>
                <div className="divide-y divide-gray-200 max-h-16 overflow-y-auto pr-1">
                  {invoice.order?.items?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-0.5 text-[10px]">
                      <span className="font-bold text-gray-900">{item.quantity}x {item.menuItemName}</span>
                      <span className="font-black text-emerald-700">{formatVND(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* 🟢 GIAO DIỆN TIỀN MẶT */
            <div className="space-y-2">
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-2 text-center space-y-0.5">
                <span className="text-[10px] font-black text-emerald-900 uppercase">TỔNG TIỀN CẦN THU:</span>
                <p className="text-senior-xl font-black text-emerald-800">
                  {formatVND(invoice.amount)}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-2 space-y-2 shadow-2xs">
                <div>
                  <label className="block font-black text-[10px] sm:text-senior-xs text-gray-800 mb-0.5 flex items-center gap-1">
                    <Calculator className="w-3.5 h-3.5 text-emerald-700" /> KHÁCH ĐƯA TIỀN MẶT (VNĐ):
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập số tiền..."
                    value={cashTenderedInput}
                    onChange={(e) => handleCashTenderedChange(e.target.value)}
                    className="w-full p-1.5 border-2 border-gray-300 rounded-lg text-senior-lg font-black text-gray-900 text-right bg-gray-50 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCashTendered(invoice.amount);
                      setCashTenderedInput(new Intl.NumberFormat('vi-VN').format(invoice.amount));
                    }}
                    className="py-1 px-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-black text-[10px] rounded border border-emerald-300 cursor-pointer"
                  >
                    Đủ {formatVND(invoice.amount)}
                  </button>
                  {[50000, 100000, 200000, 500000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setCashTendered(val);
                        setCashTenderedInput(new Intl.NumberFormat('vi-VN').format(val));
                      }}
                      className="py-1 px-1 bg-gray-100 hover:bg-sky-100 text-gray-800 font-extrabold text-[10px] rounded border border-gray-300 cursor-pointer"
                    >
                      {val / 1000}k đ
                    </button>
                  ))}
                </div>

                <div className="pt-1.5 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-black text-[10px] sm:text-senior-xs text-gray-800">TIỀN THỪA TRẢ KHÁCH:</span>
                  <span className={`font-black text-senior-base px-2 py-0.2 rounded border ${
                    changeToReturn >= 0
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-red-50 text-red-600 border-red-200'
                  }`}>
                    {changeToReturn >= 0 ? formatVND(changeToReturn) : 'Thiếu ' + formatVND(Math.abs(changeToReturn))}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg border border-gray-200 p-2 space-y-0.5">
                <p className="font-black text-[10px] text-gray-700">📋 DANH SÁCH MÓN ĐÃ ĐẶT:</p>
                <div className="divide-y divide-gray-200 max-h-16 overflow-y-auto pr-1">
                  {invoice.order?.items?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-0.5 text-[10px]">
                      <span className="font-bold text-gray-900">{item.quantity}x {item.menuItemName}</span>
                      <span className="font-black text-emerald-700">{formatVND(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 bg-white border-t border-gray-200 shadow-md flex-shrink-0">
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 px-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-extrabold text-senior-xs sm:text-senior-sm rounded-lg transition-all cursor-pointer text-center"
            >
              Đóng màn hình
            </button>

            {/* Chỉ hiển thị nút ĐÃ NHẬN TIỀN khi thanh toán TIỀN MẶT */}
            {paymentMethod === 'CASH' && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirm}
                className="flex-[2] py-2 px-3 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 active:scale-[0.97] text-white font-black text-senior-sm sm:text-senior-base rounded-lg shadow-sm border border-emerald-400 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                ĐÃ NHẬN TIỀN MẶT
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
