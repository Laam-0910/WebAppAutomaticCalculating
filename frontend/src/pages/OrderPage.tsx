import React, { useState, useEffect } from 'react';
import { MenuItem, Invoice } from '../types';
import { menuApi } from '../services/api';
import { useOrder } from '../hooks/useOrder';
import { MenuGrid } from '../components/MenuGrid';
import { OrderCart } from '../components/OrderCart';
import { PaymentPage } from '../components/PaymentPage';
import { ToastNotification } from '../components/ToastNotification';
import { buildPaymentNotificationText, announcePaymentSuccess } from '../utils/audio';
import { RefreshCw, ShoppingBag, X, AlertCircle } from 'lucide-react';

export const OrderPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState<boolean>(true);

  // Trạng thái màn hình thanh toán
  const [paymentPageData, setPaymentPageData] = useState<{
    invoice: Invoice;
    method: 'CASH' | 'BANKING';
  } | null>(null);

  // Toast thông báo sau khi nhận tiền xong
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const {
    cartItems, customerName, setCustomerName,
    discount, setDiscount, subtotal, totalAmount,
    totalItemCount, loading, addToCart, updateQuantity,
    updateItemNote, updateItemPrice, removeFromCart, clearCart,
    processCheckoutAndInvoice,
  } = useOrder();

  const [customPrices, setCustomPrices] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('sushi_custom_menu_prices');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const loadMenu = async () => {
    setLoadingMenu(true);
    try {
      const data = await menuApi.getMenuItems();
      const mergedData = data.map(item => ({
        ...item,
        price: customPrices[item.id] !== undefined ? customPrices[item.id] : item.price
      }));
      setMenuItems(mergedData);
    } catch (err) {
      console.error('Lỗi tải menu:', err);
    } finally {
      setLoadingMenu(false);
    }
  };

  useEffect(() => { loadMenu(); }, []);

  const handleUpdatePrice = (menuItemId: number, newPrice: number) => {
    const updatedCustom = { ...customPrices, [menuItemId]: newPrice };
    setCustomPrices(updatedCustom);
    try {
      localStorage.setItem('sushi_custom_menu_prices', JSON.stringify(updatedCustom));
    } catch {
      // Fallback
    }

    setMenuItems(prev => prev.map(item => item.id === menuItemId ? { ...item, price: newPrice } : item));
    updateItemPrice(menuItemId, newPrice);
  };

  const cartItemCounts = cartItems.reduce<Record<number, number>>((acc, item) => {
    acc[item.menuItem.id] = item.quantity;
    return acc;
  }, {});

  // Bấm QR hoặc Tiền mặt → Mở màn hình thanh toán (chưa phát âm thanh, chờ mẹ bấm nhận tiền)
  const handleCheckout = async (paymentMethod: 'CASH' | 'BANKING' | 'MOMO' | 'VNPAY') => {
    const invoice = await processCheckoutAndInvoice(paymentMethod as 'CASH' | 'BANKING');
    if (invoice) {
      setIsMobileCartOpen(false);
      setPaymentPageData({ invoice, method: paymentMethod as 'CASH' | 'BANKING' });
    }
  };

  // Hoàn tất đơn hàng & đóng màn hình thanh toán
  const handleConfirmPayment = (invoice: Invoice) => {
    // 1. Đóng màn hình thanh toán
    setPaymentPageData(null);

    // 2. Nếu là tiền mặt thì mới phát tiếng web thành công (QR đã phát giọng Native)
    if (paymentPageData?.method === 'CASH') {
      announcePaymentSuccess(invoice);
    }

    // 3. Hiển thị Toast thông báo nổi bật góc trên màn hình 6 giây
    const msg = buildPaymentNotificationText(invoice);
    setToastMessage(msg);
  };

  const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + ' đ';

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      {/* Banner hướng dẫn nhanh — Thu gọn siêu nhỏ tối đa hóa không gian nhìn */}
      <div className="bg-sky-50 border border-sky-300 rounded-xl px-2.5 py-1 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <AlertCircle className="w-4 h-4 text-sky-700 flex-shrink-0" />
          <p className="text-[11px] sm:text-senior-xs font-bold text-sky-900 truncate">
            💡 Chọn món ➔ Bấm <span className="font-black">QUÉT QR</span> / <span className="font-black">TIỀN MẶT</span> ➔ Khách trả xong bấm <span className="font-black text-emerald-800">ĐÃ NHẬN TIỀN</span>
          </p>
        </div>
        <button onClick={loadMenu}
          className="px-2 py-0.5 bg-white hover:bg-sky-100 text-sky-800 font-extrabold text-[10px] sm:text-senior-xs rounded-lg border border-sky-300 flex items-center gap-1 cursor-pointer whitespace-nowrap flex-shrink-0">
          <RefreshCw className={`w-3 h-3 ${loadingMenu ? 'animate-spin' : ''}`} />
          Tải lại
        </button>
      </div>

      {/* Grid chính */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Thực đơn bên trái */}
        <div className="lg:col-span-7">
          {loadingMenu ? (
            <div className="bg-white rounded-2xl p-12 text-center border-2 border-gray-200">
              <RefreshCw className="w-12 h-12 text-sky-600 animate-spin mx-auto mb-4" />
              <p className="text-senior-xl font-bold text-gray-700">Đang tải thực đơn...</p>
            </div>
          ) : (
            <MenuGrid
              items={menuItems}
              cartItemCounts={cartItemCounts}
              onAddToCart={addToCart}
              onUpdateQuantity={updateQuantity}
              onUpdatePrice={handleUpdatePrice}
            />
          )}
        </div>

        {/* Giỏ hàng Desktop bên phải */}
        <div className="hidden lg:block lg:col-span-5">
          <div className="sticky top-6">
            <OrderCart
              cartItems={cartItems} customerName={customerName} setCustomerName={setCustomerName}
              discount={discount} setDiscount={setDiscount} subtotal={subtotal}
              totalAmount={totalAmount} totalItemCount={totalItemCount} loading={loading}
              onUpdateQuantity={updateQuantity} onUpdateNote={updateItemNote}
              onRemoveFromCart={removeFromCart} onClearCart={clearCart} onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      {/* MOBILE: Nút Xem giỏ / Tính tiền thu gọn gàng */}
      <div className="lg:hidden fixed bottom-2 left-2 right-2 z-40 pb-[env(safe-area-inset-bottom,0px)]">
        <button onClick={() => setIsMobileCartOpen(true)}
          className="w-full py-2 px-3 bg-gradient-to-r from-violet-900 to-violet-800 hover:from-violet-950 hover:to-violet-900 text-white rounded-xl shadow-lg border border-violet-400 font-black text-senior-xs sm:text-senior-sm flex items-center justify-between active:scale-[0.97] transition-all cursor-pointer h-10">
          <div className="flex items-center gap-2">
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-violet-200" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-violet-400 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {totalItemCount}
                </span>
              )}
            </div>
            <span>XEM GIỎ / TÍNH TIỀN</span>
          </div>
          <span className="bg-violet-950/80 px-2 py-0.5 rounded-lg border border-violet-400 font-black text-violet-200 text-senior-xs">
            {formatVND(totalAmount)}
          </span>
        </button>
      </div>

      {/* MOBILE: Màn hình Giỏ Hàng TOÀN MÀN HÌNH (Fullscreen) */}
      {isMobileCartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col h-full w-full overflow-hidden">
          <div className="bg-violet-900 text-white px-3 py-2.5 flex items-center justify-between flex-shrink-0 shadow-md">
            <h3 className="font-black text-senior-base flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-violet-200" /> GIỎ HÀNG & TÍNH TIỀN
            </h3>
            <button onClick={() => setIsMobileCartOpen(false)} className="p-1.5 bg-violet-800 hover:bg-violet-700 rounded-full text-white cursor-pointer">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            <OrderCart
              cartItems={cartItems} customerName={customerName} setCustomerName={setCustomerName}
              discount={discount} setDiscount={setDiscount} subtotal={subtotal}
              totalAmount={totalAmount} totalItemCount={totalItemCount} loading={loading}
              onUpdateQuantity={updateQuantity} onUpdateNote={updateItemNote}
              onRemoveFromCart={removeFromCart} onClearCart={clearCart} onCheckout={handleCheckout}
            />
          </div>
        </div>
      )}

      {/* Màn hình thanh toán full-screen (QR hoặc Tiền mặt) */}
      {paymentPageData && (
        <PaymentPage
          invoice={paymentPageData.invoice}
          paymentMethod={paymentPageData.method}
          onConfirmPayment={handleConfirmPayment}
          onCancel={() => setPaymentPageData(null)}
        />
      )}

      {/* Toast thông báo đã nhận tiền */}
      <ToastNotification
        message={toastMessage}
        onDone={() => setToastMessage(null)}
      />
    </div>
  );
};
