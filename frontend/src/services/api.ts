import axios from 'axios';
import { ApiResponse, MenuItem, Order, Invoice, CreateOrderRequest, CreateInvoiceRequest } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 4000,
});

// Cache buster version token
const _VERSION = 'v20260727_force_v50_comhong_chabap';
const IMAGE_CACHE_BUSTER = `?v=20260727_50_comhong_chabap`;

// 26 MÓN ĂN & NƯỚC UỐNG CHUẨN XÁC 100% KÈM IMAGE CACHE BUSTER
const DEFAULT_MENU_ITEMS: MenuItem[] = [

  // ──────── MÌ TRỘN ────────
  {
    id: 1, name: 'Mì trộn trứng ốp la', category: 'MI', price: 30000, unit: 'PHẦN',
    imageUrl: `/icons/items/mi_tron_trung.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 2, name: 'Mì trộn topping ngẫu nhiên', category: 'MI', price: 35000, unit: 'PHẦN',
    imageUrl: `/icons/items/mi_tron_topping.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 3, name: 'Mì trộn Indo trứng ốp la', category: 'MI', price: 30000, unit: 'PHẦN',
    imageUrl: `/icons/items/mi_tron_indo.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },

  // ──────── XÚC XÍCH ────────
  {
    id: 4, name: 'Xúc xích', category: 'XUC_XICH', price: 10000, unit: 'CÂY',
    imageUrl: `/icons/items/xuc_xich_thuong.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 5, name: 'Xúc xích xông khói', category: 'XUC_XICH', price: 12000, unit: 'CÂY',
    imageUrl: `/icons/items/xuc_xich_xong_khoi.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 6, name: 'Xúc xích nhân sốt phô mai', category: 'XUC_XICH', price: 15000, unit: 'CÂY',
    imageUrl: `/icons/items/xuc_xich_pho_mai.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },

  // ──────── GÀ ────────
  {
    id: 7, name: 'Đùi gà rán', category: 'GA', price: 35000, unit: 'PHẦN',
    imageUrl: `/icons/items/dui_ga_ran.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 8, name: 'Gà viên popcorn CP', category: 'GA', price: 10000, unit: 'XIÊN',
    imageUrl: `/icons/items/ga_popcorn.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },

  // ──────── XIÊN QUE ────────
  {
    id: 9, name: 'Phô mai viên', category: 'XIEN', price: 12000, unit: 'XIÊN',
    imageUrl: `/icons/items/pho_mai_vien.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 10, name: 'Phô mai que', category: 'XIEN', price: 10000, unit: 'XIÊN',
    imageUrl: `/icons/items/pho_mai_que.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 11, name: 'Cá viên chiên', category: 'XIEN', price: 5000, unit: 'XIÊN',
    imageUrl: `/icons/items/ca_vien_chien.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 12, name: 'Bò viên chiên', category: 'XIEN', price: 5000, unit: 'XIÊN',
    imageUrl: `/icons/items/bo_vien_chien.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 13, name: 'Tôm viên chiên', category: 'XIEN', price: 5000, unit: 'XIÊN',
    imageUrl: `/icons/items/tom_vien_chien.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 14, name: 'Mực viên chiên', category: 'XIEN', price: 5000, unit: 'XIÊN',
    imageUrl: `/icons/items/muc_vien_chien.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 15, name: 'Cốm hồng', category: 'XIEN', price: 10000, unit: 'XIÊN',
    imageUrl: `/icons/items/com_hong.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 16, name: 'Cốm xanh', category: 'XIEN', price: 10000, unit: 'XIÊN',
    imageUrl: `/icons/items/com_xanh.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 17, name: 'Chả bắp hồng hà', category: 'XIEN', price: 10000, unit: 'XIÊN',
    imageUrl: `/icons/items/cha_bap.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },

  // ──────── KHÁC ────────
  {
    id: 18, name: 'Hotdog xúc xích mini', category: 'KHAC', price: 10000, unit: 'CÂY',
    imageUrl: `/icons/items/hotdog_mini.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },

  // ──────── NƯỚC GIẢI KHÁT (GIỮ NGUYÊN HOÀN TOÀN) ────────
  {
    id: 19, name: 'Pepsi', category: 'NUOC_GIAI_KHAT', price: 12000, unit: 'LON',
    imageUrl: `/icons/items/pepsi.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 20, name: 'Coca Cola', category: 'NUOC_GIAI_KHAT', price: 12000, unit: 'LON',
    imageUrl: `/icons/items/coca.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 21, name: '7Up', category: 'NUOC_GIAI_KHAT', price: 12000, unit: 'LON',
    imageUrl: `/icons/items/7up.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 22, name: 'Trà Ô Long TEA+', category: 'NUOC_GIAI_KHAT', price: 12000, unit: 'CHAI',
    imageUrl: `/icons/items/tra_olong.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 23, name: 'Revive', category: 'NUOC_GIAI_KHAT', price: 12000, unit: 'CHAI',
    imageUrl: `/icons/items/revive.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 24, name: 'Sting', category: 'NUOC_GIAI_KHAT', price: 12000, unit: 'CHAI',
    imageUrl: `/icons/items/sting.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 25, name: 'Bò Húc (Nước tăng lực)', category: 'NUOC_GIAI_KHAT', price: 13000, unit: 'LON',
    imageUrl: `/icons/items/bo_huc.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
  {
    id: 26, name: 'Nước Suối Aquafina', category: 'NUOC_GIAI_KHAT', price: 7000, unit: 'CHAI',
    imageUrl: `/icons/items/nuoc_suoi.png${IMAGE_CACHE_BUSTER}`, isAvailable: true
  },
];

const STORAGE_KEY_ORDERS = `sushi_shop_orders_${_VERSION}`;
const STORAGE_KEY_INVOICES = `sushi_shop_invoices_${_VERSION}`;

const getStoredOrders = (): Order[] => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS) || '[]'); } catch { return []; }
};
const saveStoredOrders = (o: Order[]) => localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(o));
const getStoredInvoices = (): Invoice[] => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_INVOICES) || '[]'); } catch { return []; }
};
const saveStoredInvoices = (i: Invoice[]) => localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(i));

export const menuApi = {
  getMenuItems: async (category?: string): Promise<MenuItem[]> => {
    let customPrices: Record<number, number> = {};
    try {
      const s = localStorage.getItem('sushi_custom_menu_prices');
      if (s) customPrices = JSON.parse(s);
    } catch {}

    try {
      const res = await apiClient.get<ApiResponse<MenuItem[]>>('/menu-items', { params: { category } });
      const apiItems = res.data.data;

      const mergedItems = apiItems.map(item => {
        const cleanApiName = item.name.trim().toLowerCase();
        const def = DEFAULT_MENU_ITEMS.find(d => d.name.trim().toLowerCase() === cleanApiName) ||
                    DEFAULT_MENU_ITEMS.find(d => d.id === item.id);
        const finalPrice = customPrices[item.id] !== undefined ? customPrices[item.id] : item.price;

        return {
          ...item,
          price: finalPrice,
          unit: def?.unit || item.unit || 'PHẦN',
          imageUrl: def?.imageUrl || item.imageUrl,
        };
      });

      return category && category !== 'ALL'
        ? mergedItems.filter(i => i.category === category)
        : mergedItems;
    } catch {
      const items = DEFAULT_MENU_ITEMS.map(item => ({
        ...item,
        price: customPrices[item.id] !== undefined ? customPrices[item.id] : item.price
      }));

      return category && category !== 'ALL'
        ? items.filter(i => i.category === category)
        : items;
    }
  }
};

export const orderApi = {
  createOrder: async (request: CreateOrderRequest): Promise<Order> => {
    try {
      const res = await apiClient.post<ApiResponse<Order>>('/orders', request);
      return res.data.data;
    } catch {
      const existing = getStoredOrders();
      const orderId = existing.length + 1;
      const orderCode = `ORD${new Date().toISOString().slice(0,10).replace(/-/g,'')}${String(orderId).padStart(4,'0')}`;
      let subtotal = 0;
      let customPrices: Record<number, number> = {};
      try {
        const s = localStorage.getItem('sushi_custom_menu_prices');
        if (s) customPrices = JSON.parse(s);
      } catch {}

      const orderItems = request.items.map((item, idx) => {
        const m = DEFAULT_MENU_ITEMS.find(x => x.id === item.menuItemId);
        const unitPrice = item.unitPrice ?? customPrices[item.menuItemId] ?? m?.price ?? 0;
        const sub = unitPrice * item.quantity;
        subtotal += sub;
        return { id: idx+1, menuItemId: item.menuItemId, menuItemName: m?.name ?? 'Món ăn',
          category: m?.category ?? 'KHAC', quantity: item.quantity, unitPrice, subtotal: sub, note: item.note };
      });
      const discount = request.discount ?? 0;
      const newOrder: Order = {
        id: orderId, orderCode,
        customerName: request.customerName || 'Khách lẻ',
        customerPhone: request.customerPhone || '',
        status: 'PENDING', subtotal, discount, totalAmount: Math.max(0, subtotal - discount),
        createdAt: new Date().toISOString(), items: orderItems
      };
      saveStoredOrders([newOrder, ...existing]);
      return newOrder;
    }
  },
  getAllOrders: async (): Promise<Order[]> => {
    try { return (await apiClient.get<ApiResponse<Order[]>>('/orders')).data.data; }
    catch { return getStoredOrders(); }
  },
  updateOrderStatus: async (id: number, status: string): Promise<Order> => {
    try { return (await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status })).data.data; }
    catch {
      const orders = getStoredOrders();
      const o = orders.find(x => x.id === id);
      if (o) { o.status = status as Order['status']; saveStoredOrders(orders); }
      return o ?? orders[0];
    }
  },
  clearAllOrders: async (): Promise<void> => {
    Object.keys(localStorage).forEach(key => {
      if (key.includes('sushi_shop_orders') || key.includes('horse_billing_orders') || key.includes('sushi_shop_invoices')) {
        localStorage.removeItem(key);
      }
    });
    try {
      await apiClient.delete('/orders');
    } catch {
      // Backend offline fallback handled
    }
  }
};

export const invoiceApi = {
  createInvoice: async (request: CreateInvoiceRequest): Promise<Invoice> => {
    try { return (await apiClient.post<ApiResponse<Invoice>>('/invoices', request)).data.data; }
    catch {
      const orders = getStoredOrders();
      const invoices = getStoredInvoices();
      const order = orders.find(o => o.id === request.orderId);
      const invoiceId = invoices.length + 1;
      const invoiceCode = `INV${new Date().toISOString().slice(0,10).replace(/-/g,'')}${String(invoiceId).padStart(4,'0')}`;
      if (order) { order.status = 'COMPLETED'; saveStoredOrders(orders); }
      const inv: Invoice = {
        id: invoiceId, invoiceCode, orderId: request.orderId,
        orderCode: order?.orderCode ?? '',
        customerName: order?.customerName ?? 'Khách lẻ',
        paymentMethod: request.paymentMethod, paymentStatus: 'UNPAID',
        amount: order?.totalAmount ?? 0,
        createdAt: new Date().toISOString(), order
      };
      saveStoredInvoices([inv, ...invoices]);
      if (order) { order.invoice = inv; }
      return inv;
    }
  },
  getAllInvoices: async (): Promise<Invoice[]> => {
    try { return (await apiClient.get<ApiResponse<Invoice[]>>('/invoices')).data.data; }
    catch { return getStoredInvoices(); }
  }
};
