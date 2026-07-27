import { useState, useEffect } from 'react';
import { OrderPage } from './pages/OrderPage';
import { HistoryPage } from './pages/HistoryPage';
import { BankSettingsModal } from './components/BankSettingsModal';
import { NotificationGuideModal } from './components/NotificationGuideModal';
import { playChimeSound, speakVietnameseText, initAudioWorkarounds } from './utils/audio';
import {
  Menu, X, ShoppingCart, History, Building2, ChevronRight,
  ZoomIn, Volume2, Sparkles, Bell
} from 'lucide-react';

const ZOOM_CONFIGS = [
  { level: 1, label: '1/5 (85%)', scale: 0.85 },
  { level: 2, label: '2/5 (92%)', scale: 0.92 },
  { level: 3, label: '3/5 (100% Chuẩn)', scale: 1.0 },
  { level: 4, label: '4/5 (110%)', scale: 1.1 },
  { level: 5, label: '5/5 (120%)', scale: 1.2 },
];

export function App() {
  const [activeTab, setActiveTab] = useState<'POS' | 'HISTORY'>('POS');
  const [isBankModalOpen, setIsBankModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState<boolean>(false);

  // Fix 4: Khởi tạo workaround âm thanh Android ngay khi app load
  useEffect(() => { initAudioWorkarounds(); }, []);
  // 🔍 Quản lý Thu Phóng Giao Diện (Default = Level 3/5: 100% chuẩn di động)
  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sushi_app_zoom_level');
      return saved ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  const currentScale = ZOOM_CONFIGS.find(z => z.level === zoomLevel)?.scale ?? 1.0;

  const handleSelectZoomLevel = (lvl: number) => {
    setZoomLevel(lvl);
    try {
      localStorage.setItem('sushi_app_zoom_level', String(lvl));
    } catch {
      // Fallback
    }
  };

  const handleSelectTab = (tab: 'POS' | 'HISTORY') => {
    setActiveTab(tab);
    setIsNavDrawerOpen(false);
  };

  const handleTestVoiceAnnouncement = () => {
    playChimeSound();
    setTimeout(() => {
      speakVietnameseText('Kiểm tra âm thanh Keng Keng và giọng nữ thông báo tiếng Việt thành công!');
    }, 800);
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col font-sans max-w-full overflow-x-hidden relative"
      style={{ zoom: currentScale } as React.CSSProperties}
    >
      
      {/* 🟢 THANH MENU NỔI SIÊU GỌN NẰM NGAY GÓC BÊN TRÁI MÀN HÌNH (Theo yêu cầu 1/) */}
      <div className="fixed top-3 left-3 z-40 flex items-center gap-2 bg-sky-950/95 backdrop-blur-md text-white p-1.5 pr-4 rounded-full border-2 border-sky-500 shadow-2xl transition-all hover:scale-105">
        {/* NÚT 3 GẠCH KÍCH HOẠT MENU PHONG CÁCH FACEBOOK */}
        <button
          type="button"
          onClick={() => setIsNavDrawerOpen(true)}
          className="p-2 bg-sky-800 hover:bg-sky-700 active:scale-95 text-white rounded-full border border-sky-400 flex items-center justify-center transition-all cursor-pointer shadow-md"
          title="Mở danh mục menu"
        >
          <Menu className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* LOGO "SUSHI ĂN VẶT" TRÒN GỌN GÀNG GÓC BÊN TRÁI */}
        <div
          onClick={() => setIsNavDrawerOpen(true)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src="/icons/logo_sushi_an_vat.png"
            alt="Sushi Ăn Vặt"
            className="w-8 h-8 rounded-full border border-amber-300 shadow-sm object-cover flex-shrink-0"
          />
          <span className="font-black text-senior-base text-white tracking-tight leading-none">
            SUSHI ĂN VẶT
          </span>
        </div>
      </div>

      {/* SIDE DRAWER MENU (MỞ TỪ BÊN TRÁI ĐỒNG BỘ VỚI NÚT 3 GẠCH GÓC TRÁI) */}
      {isNavDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Lớp nền mờ khi mở menu */}
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
            onClick={() => setIsNavDrawerOpen(false)}
          />

          {/* Khung menu mở từ góc BÊN TRÁI */}
          <div className="relative mr-auto w-84 max-w-[88vw] bg-sky-950 text-white h-full shadow-2xl flex flex-col z-10 border-r-4 border-sky-600">
            {/* Header của Drawer Menu */}
            <div className="p-4 bg-sky-900 border-b border-sky-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/icons/logo_sushi_an_vat.png"
                  alt="Logo"
                  className="w-11 h-11 rounded-full border-2 border-amber-300 shadow-md"
                />
                <div>
                  <h3 className="font-black text-senior-lg text-white">SUSHI ĂN VẶT</h3>
                  <p className="text-senior-xs text-amber-300 font-extrabold">DANH MỤC CHỨC NĂNG</p>
                </div>
              </div>
              <button
                onClick={() => setIsNavDrawerOpen(false)}
                className="p-2 bg-sky-800 hover:bg-sky-700 text-white rounded-full transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Danh sách các mục chức năng */}
            <div className="p-4 space-y-3 flex-1 overflow-y-auto">
              <button
                onClick={() => handleSelectTab('POS')}
                className={`w-full p-4 rounded-2xl font-black text-senior-lg flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'POS'
                    ? 'bg-sky-600 text-white shadow-lg border-2 border-sky-400'
                    : 'bg-sky-900/60 hover:bg-sky-800 text-sky-100 border border-sky-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-amber-300 stroke-[2.5]" />
                  <span>🛒 GỌI MÓN (POS)</span>
                </div>
                <ChevronRight className="w-5 h-5 text-sky-300" />
              </button>

              <button
                onClick={() => handleSelectTab('HISTORY')}
                className={`w-full p-4 rounded-2xl font-black text-senior-lg flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'HISTORY'
                    ? 'bg-sky-600 text-white shadow-lg border-2 border-sky-400'
                    : 'bg-sky-900/60 hover:bg-sky-800 text-sky-100 border border-sky-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <History className="w-6 h-6 text-emerald-400 stroke-[2.5]" />
                  <span>📜 LỊCH SỬ HÓA ĐƠN</span>
                </div>
                <ChevronRight className="w-5 h-5 text-sky-300" />
              </button>

              {/* 🔍 KHU VỰC THU PHÓNG GIAO DIỆN (Yêu cầu 2/) */}
              <div className="bg-sky-900/90 rounded-2xl p-3.5 border-2 border-sky-700 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ZoomIn className="w-5 h-5 text-amber-300" />
                    <span className="font-extrabold text-senior-base text-white">THU PHÓNG GIAO DIỆN</span>
                  </div>
                  <span className="bg-amber-400 text-sky-950 text-senior-xs px-2 py-0.5 rounded-full font-black">
                    {ZOOM_CONFIGS.find(z => z.level === zoomLevel)?.label}
                  </span>
                </div>
                
                {/* 5 Nấc chọn nhanh kích thước */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {ZOOM_CONFIGS.map((cfg) => {
                    const isSelected = zoomLevel === cfg.level;
                    const isDefault = cfg.level === 3;
                    return (
                      <button
                        key={cfg.level}
                        type="button"
                        onClick={() => handleSelectZoomLevel(cfg.level)}
                        className={`py-2 text-center rounded-xl font-black text-senior-sm transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-amber-400 text-sky-950 border-2 border-white shadow-md scale-105'
                            : 'bg-sky-800/80 hover:bg-sky-700 text-sky-100 border border-sky-600'
                        }`}
                        title={`Nấc ${cfg.level}/5 (${cfg.label})`}
                      >
                        <span>{cfg.level}</span>
                        {isDefault && <span className="text-[10px] opacity-85 leading-none">Chuẩn</span>}
                      </button>
                    );
                  })}
                </div>
                <p className="text-senior-xs text-sky-300 font-bold text-center pt-0.5">
                  ⭐ Nấc 3/5 là nấc chuẩn tối ưu nhất cho màn hình điện thoại.
                </p>
              </div>

              {/* 🔊 NÚT THỬ GIỌNG NỮ ĐỌC THÔNG BÁO VÀ TIẾNG CHUÔNG KENG KENG */}
              <button
                type="button"
                onClick={handleTestVoiceAnnouncement}
                className="w-full p-3 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-senior-base rounded-2xl flex items-center justify-between border-2 border-emerald-400 transition-all cursor-pointer shadow-md"
              >
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span>🔊 THỬ ÂM THÀNH THÔNG BÁO</span>
                </div>
                <Sparkles className="w-5 h-5 text-amber-300" />
              </button>

              <div className="pt-2 border-t border-sky-800 space-y-2">
                <button
                  onClick={() => {
                    setIsNavDrawerOpen(false);
                    setIsGuideModalOpen(true);
                  }}
                  className="w-full p-3.5 bg-amber-500 hover:bg-amber-600 text-sky-950 font-black text-senior-base rounded-2xl flex items-center justify-between border-2 border-amber-300 transition-all cursor-pointer shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-6 h-6 text-sky-950 fill-current animate-bounce" />
                    <span>🔔 HƯỚNG DẪN BẬT ĐỌC THÔNG BÁO MBBANK</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-sky-950" />
                </button>

                <button
                  onClick={() => {
                    setIsNavDrawerOpen(false);
                    setIsBankModalOpen(true);
                  }}
                  className="w-full p-3.5 bg-sky-800/90 hover:bg-sky-800 text-sky-100 font-extrabold text-senior-base rounded-2xl flex items-center justify-between border border-sky-700 transition-all cursor-pointer shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-emerald-400" />
                    <span>🏦 CÀI STK NGÂN HÀNG</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-sky-300" />
                </button>
              </div>
            </div>

            {/* Footer Drawer */}
            <div className="p-3 bg-sky-900 border-t border-sky-800 text-center text-senior-xs text-sky-300 font-bold">
              Phần mềm POS Sushi Ăn Vặt v2.0
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-16 sm:pt-16 pb-8">
        {activeTab === 'POS' ? <OrderPage /> : <HistoryPage />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-300 py-3 text-center text-gray-700 text-senior-base font-bold mt-6">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
          <img src="/icons/logo_sushi_an_vat.png" alt="Logo" className="w-6 h-6 rounded-full" />
          <span>Phần mềm tính tiền tự động Sushi Ăn Vặt</span>
        </div>
      </footer>

      {/* Modal Cài Đặt STK Ngân Hàng */}
      <BankSettingsModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
      />

      {/* Modal Hướng Dẫn Bật Quyền Đọc Thông Báo MBBank */}
      <NotificationGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}

export default App;


