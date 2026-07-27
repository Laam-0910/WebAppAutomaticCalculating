import React, { useState, useEffect } from 'react';
import { Invoice, BankConfig } from '../types';
import { Printer, CheckCircle, X, QrCode, Settings, Volume2, ShoppingBag } from 'lucide-react';
import { getSavedBankConfig, BankSettingsModal } from './BankSettingsModal';
import { announcePaymentSuccess } from '../utils/audio';

interface InvoiceViewProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({ invoice, onClose }) => {
  const [bankConfig, setBankConfig] = useState<BankConfig>(getSavedBankConfig());
  const [isBankModalOpen, setIsBankModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setBankConfig(getSavedBankConfig());
  }, [invoice, isBankModalOpen]);

  if (!invoice) return null;

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return new Date().toLocaleString('vi-VN');
    return new Date(dateStr).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'CASH': return '💵 Tiền mặt';
      case 'BANKING': return '🏦 Chuyển khoản VietQR';
      case 'MOMO': return '📱 Ví MoMo';
      case 'VNPAY': return '💳 VNPay';
      default: return method;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReplayAudio = () => {
    announcePaymentSuccess(invoice);
  };

  const vietQrImageUrl = `https://img.vietqr.io/image/${bankConfig.bankId}-${bankConfig.accountNo}-compact2.jpg?amount=${invoice.amount}&addInfo=${encodeURIComponent(invoice.invoiceCode)}&accountName=${encodeURIComponent(bankConfig.accountName)}`;

  const itemsSummaryList = invoice.order?.items?.map(item => `${item.quantity} ${item.menuItemName}`).join(', ');

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-2 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-md w-full p-3 sm:p-4 shadow-2xl border-2 border-emerald-600 relative my-auto">
          {/* Nút Đóng */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full font-extrabold transition-all cursor-pointer"
            title="Đóng hóa đơn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Hóa Đơn */}
          <div className="text-center pb-3 border-b border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-100 text-emerald-800 rounded-full mb-1">
              <CheckCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h2 className="text-senior-lg font-black text-gray-900">SUSHI SHOP</h2>
            <p className="text-senior-xs text-gray-600 font-bold">
              HÓA ĐƠN THANH TOÁN TÍNH TIỀN
            </p>
            <p className="text-[10px] text-gray-500 font-medium">
              Ngày lập: {formatDate(invoice.createdAt)}
            </p>
          </div>

          {/* Chi tiết thông tin */}
          <div className="py-2 space-y-1 text-senior-xs border border-gray-200 bg-gray-50 p-2.5 rounded-lg my-2">
            <div className="flex justify-between">
              <span className="text-gray-600 font-bold">Mã hóa đơn:</span>
              <span className="font-extrabold text-gray-900">{invoice.invoiceCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-bold">Mã đơn hàng:</span>
              <span className="font-extrabold text-gray-900">{invoice.orderCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-bold">Khách hàng:</span>
              <span className="font-extrabold text-gray-900">{invoice.customerName || 'Khách lẻ'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-bold">Hình thức:</span>
              <span className="font-black text-sky-800">{getPaymentMethodText(invoice.paymentMethod)}</span>
            </div>
          </div>

          {/* THÔNG TIN SỐ LƯỢNG MÓN ĐÃ YÊU CẦU */}
          <div className="py-2 bg-sky-50/70 p-2.5 rounded-xl border border-sky-300 my-2">
            <h4 className="font-black text-senior-xs text-sky-900 mb-1.5 flex items-center gap-1.5 border-b border-sky-300 pb-1">
              <ShoppingBag className="w-4 h-4 text-sky-700" />
              DANH SÁCH MÓN ĐÃ ĐẶT:
            </h4>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-0.5">
              {invoice.order?.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded-lg border border-sky-200 shadow-2xs text-senior-xs">
                  <div>
                    <span className="font-black text-sky-900 mr-1.5">
                      {item.quantity}x
                    </span>
                    <span className="font-black text-gray-900">
                      {item.menuItemName}
                    </span>
                    {item.note && (
                      <p className="text-[10px] text-gray-500 font-bold">
                        📝 {item.note}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-500 font-bold">{item.quantity} x {formatVND(item.unitPrice)}</div>
                    <div className="font-black text-emerald-700">{formatVND(item.subtotal)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tổng tiền thanh toán */}
          <div className="pt-1 space-y-1">
            {invoice.order && invoice.order.discount > 0 && (
              <div className="flex justify-between text-senior-xs text-red-600 font-bold px-1">
                <span>Giảm giá:</span>
                <span>- {formatVND(invoice.order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center bg-emerald-50 p-2.5 rounded-xl border border-emerald-400">
              <span className="text-senior-xs font-black text-gray-900">TỔNG TIỀN THANH TOÁN:</span>
              <span className="text-senior-xl font-black text-emerald-800">
                {formatVND(invoice.amount)}
              </span>
            </div>
          </div>

          {/* Lời cảm ơn */}
          <p className="text-center text-[10px] text-gray-600 font-bold mt-2 italic">
            Cảm ơn quý khách và hẹn gặp lại! 🙏
          </p>

          {/* Nút bấm in hóa đơn và hoàn tất */}
          <div className="mt-3 flex gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={handlePrint}
              className="flex-1 py-2 px-3 bg-sky-700 hover:bg-sky-800 text-white font-black text-senior-xs rounded-lg shadow-2xs flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              IN HÓA ĐƠN
            </button>

            <button
              onClick={handleReplayAudio}
              className="py-2 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-senior-xs rounded-lg border border-emerald-300 flex items-center justify-center gap-1 transition-all cursor-pointer"
              title="Thử nghe giọng đọc hóa đơn"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-senior-xs rounded-lg shadow-2xs flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              ĐÓNG HÓA ĐƠN
            </button>
          </div>
        </div>
      </div>

      {/* Modal Cấu Hình Tài Khoản Ngân Hàng */}
      <BankSettingsModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
      />
    </>
  );
};
