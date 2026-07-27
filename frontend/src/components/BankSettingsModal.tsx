import React, { useState, useEffect } from 'react';
import { BankConfig } from '../types';
import { Building2, Check, X, QrCode } from 'lucide-react';

interface BankSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LIST_VIETNAM_BANKS = [
  { id: 'MB', name: 'MBBank - Ngân hàng Quân Đội' },
  { id: 'VCB', name: 'Vietcombank - Ngân hàng Ngoại Thương' },
  { id: 'TCB', name: 'Techcombank - Ngân hàng Kỹ Thương' },
  { id: 'ICB', name: 'VietinBank - Ngân hàng Công Thương' },
  { id: 'BIDV', name: 'BIDV - Ngân hàng Đầu tư & Phát triển' },
  { id: 'ACB', name: 'ACB - Ngân hàng Á Châu' },
  { id: 'VPB', name: 'VPBank - Ngân hàng Thịnh Vượng' },
  { id: 'TPB', name: 'TPBank - Ngân hàng Tiên Phong' },
  { id: 'STB', name: 'Sacombank - Ngân hàng Sài Gòn Thương Tín' },
  { id: 'VIB', name: 'VIB - Ngân hàng Quốc Tế' },
];

export const DEFAULT_BANK_CONFIG: BankConfig = {
  bankId: '',
  bankName: '',
  accountNo: '',
  accountName: ''
};

export const getSavedBankConfig = (): BankConfig => {
  const saved = localStorage.getItem('horse_billing_bank_config');
  if (!saved) return DEFAULT_BANK_CONFIG;
  try { return JSON.parse(saved); }
  catch { return DEFAULT_BANK_CONFIG; }
};

// ─── Tab Cấu Hình Ngân Hàng ───────────────────────────────────────────────────
const BankConfigTab: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [bankConfig, setBankConfig] = useState<BankConfig>(DEFAULT_BANK_CONFIG);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    setBankConfig(getSavedBankConfig());
    setSavedSuccess(false);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('horse_billing_bank_config', JSON.stringify(bankConfig));
    setSavedSuccess(true);
    setTimeout(() => onClose(), 1200);
  };

  return (
    <form onSubmit={handleSave} className="py-4 space-y-4">
      {/* Chọn Ngân Hàng */}
      <div>
        <label className="block font-black text-senior-base text-gray-800 mb-1">1. Tên Ngân Hàng:</label>
        <select
          value={bankConfig.bankId}
          onChange={(e) => {
            const selected = LIST_VIETNAM_BANKS.find(b => b.id === e.target.value);
            setBankConfig({ ...bankConfig, bankId: e.target.value, bankName: selected ? selected.name : e.target.value });
          }}
          className="w-full p-3.5 border-2 border-gray-300 rounded-xl text-senior-base text-gray-900 font-bold bg-white focus:border-sky-600"
        >
          {LIST_VIETNAM_BANKS.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Số Tài Khoản */}
      <div>
        <label className="block font-black text-senior-base text-gray-800 mb-1">2. Số Tài Khoản (STK):</label>
        <input
          type="text" required placeholder="Nhập số tài khoản của bạn (ví dụ: 0123456789)..."
          value={bankConfig.accountNo}
          onChange={(e) => setBankConfig({ ...bankConfig, accountNo: e.target.value.trim() })}
          className="w-full p-3.5 border-2 border-gray-300 rounded-xl text-senior-lg text-gray-900 font-black bg-white focus:border-sky-600"
        />
      </div>

      {/* Tên Chủ Tài Khoản */}
      <div>
        <label className="block font-black text-senior-base text-gray-800 mb-1">3. Tên Chủ Tài Khoản:</label>
        <input
          type="text" required placeholder="Nhập tên chủ tài khoản (ví dụ: NGUYEN VAN A)..."
          value={bankConfig.accountName}
          onChange={(e) => setBankConfig({ ...bankConfig, accountName: e.target.value.toUpperCase() })}
          className="w-full p-3.5 border-2 border-gray-300 rounded-xl text-senior-base text-gray-900 font-bold bg-white focus:border-sky-600 uppercase"
        />
      </div>

      {/* Xem Trước Mã QR */}
      <div className="bg-sky-50 p-4 rounded-2xl border-2 border-sky-300 text-center">
        <p className="font-extrabold text-senior-base text-sky-900 mb-2 flex items-center justify-center gap-2">
          <QrCode className="w-6 h-6" /> MÃ VIETQR TỰ ĐỘNG
        </p>
        <div className="bg-white p-3 inline-block rounded-xl border border-sky-200 shadow-sm">
          <img
            src={`https://img.vietqr.io/image/${bankConfig.bankId}-${bankConfig.accountNo}-compact2.jpg?amount=50000&addInfo=TESTQR&accountName=${encodeURIComponent(bankConfig.accountName)}`}
            alt="Mã VietQR Ngân hàng"
            className="w-36 h-36 mx-auto object-contain"
          />
        </div>
        <p className="text-senior-sm text-sky-800 font-bold mt-1">
          {bankConfig.bankName} • STK: <span className="font-black text-gray-900">{bankConfig.accountNo}</span> • <span className="font-black text-gray-900">{bankConfig.accountName}</span>
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-800 font-black text-senior-base rounded-xl text-center flex items-center justify-center gap-2">
          <Check className="w-6 h-6 stroke-[3]" /> Đã lưu thành công!
        </div>
      )}

      <button
        type="submit"
        className="w-full py-4 px-6 bg-sky-700 hover:bg-sky-800 text-white font-black text-senior-xl rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        LƯU CẤU HÌNH NGÂN HÀNG
      </button>
    </form>
  );
};

// ─── Modal chính ──────────────────────────────────────────────────────────────
export const BankSettingsModal: React.FC<BankSettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-4 border-sky-600 relative my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b-2 border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-sky-100 text-sky-800 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-senior-lg font-black text-gray-900 leading-tight">CẤU HÌNH NGÂN HÀNG</h2>
              <p className="text-[11px] text-gray-500 font-bold">Cấu hình thông tin mã QR chuyển khoản</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung — cuộn được */}
        <div className="overflow-y-auto px-5 flex-1">
          <BankConfigTab onClose={onClose} />
        </div>
      </div>
    </div>
  );
};
