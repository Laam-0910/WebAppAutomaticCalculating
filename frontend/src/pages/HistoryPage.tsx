import React, { useState, useEffect } from 'react';
import { Order, Invoice } from '../types';
import { orderApi, invoiceApi } from '../services/api';
import { InvoiceView } from '../components/InvoiceView';
import {
  RefreshCw, Receipt, Clock, CheckCircle2, XCircle, Eye,
  Trash2, AlertTriangle, DollarSign, ShoppingBag, Banknote, QrCode
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Trạng thái hiển thị dialog xác nhận xóa lịch sử
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [isClearing, setIsClearing] = useState<boolean>(false);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch { return dateStr; }
  };

  const loadHistory = async () => {
    setLoading(true);
    try {
      const [fetchedOrders, fetchedInvoices] = await Promise.all([
        orderApi.getAllOrders(),
        invoiceApi.getAllInvoices()
      ]);
      setOrders(fetchedOrders);
      setInvoices(fetchedInvoices);
    } catch (err) {
      console.error('Lỗi tải lịch sử đơn hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Xóa toàn bộ lịch sử đơn hàng & hóa đơn
  const handleClearAllHistory = async () => {
    setIsClearing(true);
    try {
      await orderApi.clearAllOrders();
      setOrders([]);
      setInvoices([]);
      setShowClearConfirm(false);
    } catch (err) {
      console.error('Lỗi khi xóa lịch sử:', err);
    } finally {
      setIsClearing(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'ALL') return true;
    return o.status === statusFilter;
  });

  // Thống kê doanh thu
  const completedOrders = orders.filter(o => o.status === 'COMPLETED' || o.invoice?.paymentStatus === 'PAID');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const cashOrders = invoices.filter(i => i.paymentMethod === 'CASH');
  const qrOrders = invoices.filter(i => i.paymentMethod === 'BANKING');
  const cashRevenue = cashOrders.reduce((sum, i) => sum + i.amount, 0);
  const qrRevenue = qrOrders.reduce((sum, i) => sum + i.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-senior-base rounded-full border border-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Hoàn thành
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 font-extrabold text-senior-base rounded-full border border-amber-300">
            <Clock className="w-5 h-5 text-amber-700" /> Chờ thanh toán
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 font-extrabold text-senior-base rounded-full border border-red-300">
            <XCircle className="w-5 h-5 text-red-700" /> Đã hủy
          </span>
        );
      default:
        return <span className="font-bold text-gray-700">{status}</span>;
    }
  };

  const handleViewInvoice = (order: Order) => {
    const inv = invoices.find(i => i.orderId === order.id || i.orderCode === order.orderCode) || order.invoice;
    if (inv) {
      setSelectedInvoice(inv);
    } else {
      setSelectedInvoice({
        id: order.id,
        invoiceCode: `INV-${order.orderCode}`,
        orderId: order.id,
        orderCode: order.orderCode,
        customerName: order.customerName,
        paymentMethod: 'CASH',
        paymentStatus: 'PAID',
        amount: order.totalAmount,
        createdAt: order.createdAt,
        order
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Header Lịch sử & Nút chức năng */}
      <div className="bg-white rounded-2xl p-3 border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-senior-base font-black text-gray-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-sky-700" />
            LỊCH SỬ ĐƠN HÀNG & BÁO CÁO DOANH THU
          </h2>
          <p className="text-[11px] text-gray-600 font-bold">
            Xem chi tiết danh sách bán hàng, xem lại hóa đơn và quản lý lịch sử.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={loadHistory}
            className="flex-1 sm:flex-none px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white font-black text-senior-xs rounded-xl border border-sky-800 flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            TẢI LẠI
          </button>

          {/* Nút Xóa tất cả lịch sử giao dịch nổi bật */}
          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={orders.length === 0}
            className={`flex-1 sm:flex-none px-3 py-1.5 font-black text-senior-xs rounded-xl border flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs ${
              orders.length === 0
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white border-red-700'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            XÓA LỊCH SỬ
          </button>
        </div>
      </div>

      {/* Thẻ Thống kê Doanh thu Tổng quan */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-2 shadow-2xs flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black text-emerald-800 uppercase truncate">TỔNG DOANH THU</p>
            <p className="text-senior-xs sm:text-senior-sm font-black text-emerald-900 truncate">{formatVND(totalRevenue)}</p>
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-300 rounded-xl p-2 shadow-2xs flex items-center gap-2">
          <div className="w-8 h-8 bg-sky-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
            <QrCode className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black text-sky-800 uppercase truncate">CHUYỂN KHOẢN QR</p>
            <p className="text-senior-xs sm:text-senior-sm font-black text-sky-900 truncate">{formatVND(qrRevenue)}</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-300 rounded-xl p-2 shadow-2xs flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
            <Banknote className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black text-amber-800 uppercase truncate">TIỀN MẶT</p>
            <p className="text-senior-xs sm:text-senior-sm font-black text-amber-900 truncate">{formatVND(cashRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Tabs Lọc trạng thái */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {[
          { key: 'ALL', label: `📋 TẤT CẢ (${orders.length})` },
          { key: 'COMPLETED', label: `✅ HOÀN THÀNH (${orders.filter(o => o.status === 'COMPLETED').length})` },
          { key: 'PENDING', label: `⏳ CHỜ THANH TOÁN (${orders.filter(o => o.status === 'PENDING').length})` },
          { key: 'CANCELLED', label: `❌ ĐÃ HỦY (${orders.filter(o => o.status === 'CANCELLED').length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-2.5 py-1 rounded-xl font-black text-[11px] whitespace-nowrap border cursor-pointer transition-all ${
              statusFilter === tab.key
                ? 'bg-sky-800 text-white border-sky-800 shadow-2xs'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      {loading ? (
        <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-2xs">
          <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mx-auto mb-2" />
          <p className="text-senior-base font-bold text-gray-700">Đang tải lịch sử...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-300 shadow-2xs">
          <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-senior-base font-black text-gray-600">Chưa có đơn hàng nào!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredOrders.map(order => {
            const inv = invoices.find(i => i.orderId === order.id || i.orderCode === order.orderCode) || order.invoice;
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-3 border border-gray-200 shadow-2xs space-y-2"
              >
                {/* Header đơn hàng */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-senior-xs font-black text-sky-900 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
                      {order.orderCode}
                    </span>
                    {getStatusBadge(order.status)}

                    {/* Badge phương thức thanh toán */}
                    {inv?.paymentMethod === 'BANKING' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-100 text-sky-900 font-extrabold text-[10px] rounded-full border border-sky-300">
                        <QrCode className="w-3 h-3 text-sky-700" /> VietQR
                      </span>
                    ) : inv?.paymentMethod === 'CASH' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-900 font-extrabold text-[10px] rounded-full border border-emerald-300">
                        <Banknote className="w-3 h-3 text-emerald-700" /> Tiền mặt
                      </span>
                    ) : null}
                  </div>

                  <span className="text-[10px] font-bold text-gray-500">
                    🕒 {formatDate(order.createdAt)}
                  </span>
                </div>

                {/* Danh sách món trong đơn */}
                <div className="bg-gray-50 rounded-xl p-2 border border-gray-200 divide-y divide-gray-200 max-h-24 overflow-y-auto">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-1 first:pt-0 last:pb-0 flex justify-between items-center text-senior-xs">
                      <div>
                        <span className="font-bold text-gray-900">
                          {item.quantity}x {item.menuItemName}
                        </span>
                        {item.note && (
                          <span className="text-[10px] text-gray-500 font-bold ml-1">
                            (📝 {item.note})
                          </span>
                        )}
                      </div>
                      <span className="font-extrabold text-gray-800">
                        {formatVND(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer đơn hàng: Tổng tiền & Nút xem hóa đơn */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold">TỔNG: </span>
                    <span className="text-senior-base font-black text-emerald-800 ml-1">
                      {formatVND(order.totalAmount)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleViewInvoice(order)}
                    className="py-1.5 px-3 bg-sky-700 hover:bg-sky-800 text-white font-black text-senior-xs rounded-xl shadow-2xs flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    XEM HÓA ĐƠN
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* POPUP MODAL XÁC NHẬN XÓA TẤT CẢ LỊCH SỬ GIAO DỊCH */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-red-500 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <AlertTriangle className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-black text-senior-2xl text-red-700 leading-tight">
                XÁC NHẬN XÓA TẤT CẢ LỊCH SỬ?
              </h3>
              <p className="text-senior-base text-gray-700 font-bold leading-relaxed">
                Bạn có chắc chắn muốn <span className="text-red-600 font-black">XÓA VĨNH VIỄN</span> toàn bộ lịch sử đơn hàng và hóa đơn không?
              </p>
              <p className="text-senior-sm text-gray-500 font-bold bg-red-50 p-3 rounded-xl border border-red-200">
                ⚠️ Hành động này sẽ xóa sạch báo cáo doanh thu và không thể khôi phục lại được!
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleClearAllHistory}
                disabled={isClearing}
                className="w-full py-4 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-black text-senior-xl rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer border-2 border-red-700"
              >
                {isClearing ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <Trash2 className="w-6 h-6" />
                )}
                {isClearing ? 'ĐANG XÓA...' : 'ĐỒNG Ý XÓA VĨNH VIỄN'}
              </button>

              <button
                onClick={() => setShowClearConfirm(false)}
                disabled={isClearing}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-senior-base rounded-xl transition-all cursor-pointer border border-gray-300"
              >
                Quay lại (Không xóa)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal Popup */}
      <InvoiceView
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
};
