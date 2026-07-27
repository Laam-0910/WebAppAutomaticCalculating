import { useState, useMemo } from 'react';
import { MenuItem, CartItem, Order, Invoice, CreateInvoiceRequest } from '../types';
import { orderApi, invoiceApi } from '../services/api';

export function useOrder() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  const [lastInvoice, setLastInvoice] = useState<Invoice | null>(null);

  // Thêm món vào giỏ hàng
  const addToCart = (menuItem: MenuItem) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.menuItem.id === menuItem.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      }
      return [...prev, { menuItem, quantity: 1, note: '' }];
    });
  };

  // Thay đổi số lượng món
  const updateQuantity = (menuItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.menuItem.id === menuItemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Thêm / Cập nhật Ghi chú món ăn
  const updateItemNote = (menuItemId: number, note: string) => {
    setCartItems(prev =>
      prev.map(item =>
        item.menuItem.id === menuItemId
          ? { ...item, note }
          : item
      )
    );
  };

  // Cập nhật giá món ăn trực tiếp trong giỏ hàng
  const updateItemPrice = (menuItemId: number, newPrice: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.menuItem.id === menuItemId
          ? { ...item, menuItem: { ...item.menuItem, price: newPrice } }
          : item
      )
    );
  };

  // Xóa món khỏi giỏ hàng
  const removeFromCart = (menuItemId: number) => {
    setCartItems(prev => prev.filter(item => item.menuItem.id !== menuItemId));
  };


  // Xóa sạch giỏ hàng & reset toàn bộ trạng thái tạm
  const clearCart = () => {
    setCartItems([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscount(0);
    setLastCreatedOrder(null);
  };

  // Tự động tính toán tổng tiền chính xác
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  }, [cartItems]);

  const totalAmount = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);

  const totalItemCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Đặt đơn hàng mới từ giỏ hàng hiện tại
  const submitOrder = async (): Promise<Order | null> => {
    if (cartItems.length === 0) return null;
    setLoading(true);
    try {
      const orderData = await orderApi.createOrder({
        customerName: customerName.trim() || 'Khách lẻ',
        customerPhone: customerPhone.trim() || undefined,
        discount: discount,
        items: cartItems.map(item => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          unitPrice: item.menuItem.price,
          note: item.note
        }))
      });
      setLastCreatedOrder(orderData);
      return orderData;
    } catch (err) {
      console.error('Lỗi tạo đơn hàng:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Thanh toán và Xuất Hóa đơn CHUẨN TỪ GIỎ HÀNG HIỆN TẠI (Chống lỗi 0đ)
  const processCheckoutAndInvoice = async (
    paymentMethod: 'CASH' | 'BANKING' | 'MOMO' | 'VNPAY'
  ): Promise<Invoice | null> => {
    if (cartItems.length === 0) return null; // Ngăn chặn tuyệt đối thanh toán giỏ hàng rỗng

    // Lưu snapshot giỏ hàng TRƯỚC KHI xóa — để TTS đọc đúng tên từng món
    const cartSnapshot = [...cartItems];

    setLoading(true);
    try {
      // Luôn tạo đơn hàng mới từ danh sách món trong giỏ hàng hiện tại
      const order = await submitOrder();
      if (!order) return null;

      const invoiceReq: CreateInvoiceRequest = {
        orderId: order.id,
        paymentMethod
      };

      const invoiceData = await invoiceApi.createInvoice(invoiceReq);
      setLastInvoice(invoiceData);
      clearCart(); // Xóa sạch giỏ sau khi đã chốt hóa đơn

      // Đảm bảo invoice.order và invoice.amount khớp 100% với giá thực tế đã chỉnh sửa trong giỏ hàng
      const actualSubtotal = cartSnapshot.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
      const actualTotalAmount = Math.max(0, actualSubtotal - discount);

      invoiceData.amount = actualTotalAmount;
      if (!invoiceData.order) {
        invoiceData.order = order;
      }
      invoiceData.order.subtotal = actualSubtotal;
      invoiceData.order.discount = discount;
      invoiceData.order.totalAmount = actualTotalAmount;
      invoiceData.order.items = cartSnapshot.map((ci, idx) => ({
        id: idx + 1,
        menuItemId: ci.menuItem.id,
        menuItemName: ci.menuItem.name,
        category: ci.menuItem.category,
        quantity: ci.quantity,
        unitPrice: ci.menuItem.price,
        subtotal: ci.menuItem.price * ci.quantity,
        note: ci.note
      }));

      return invoiceData;
    } catch (err) {
      console.error('Lỗi thanh toán hóa đơn:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    cartItems,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    discount,
    setDiscount,
    subtotal,
    totalAmount,
    totalItemCount,
    loading,
    lastCreatedOrder,
    lastInvoice,
    setLastInvoice,
    addToCart,
    updateQuantity,
    updateItemNote,
    updateItemPrice,
    removeFromCart,
    clearCart,
    submitOrder,
    processCheckoutAndInvoice,
  };
}
