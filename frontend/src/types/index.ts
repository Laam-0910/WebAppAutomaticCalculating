export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  unit?: string; // PHẦN, CÂY, XIÊN, LON, CHAI
  imageUrl?: string;
  isAvailable: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  note?: string;
}

export interface OrderItem {
  id: number;
  menuItemId: number;
  menuItemName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  note?: string;
}

export interface Order {
  id: number;
  orderCode: string;
  customerName?: string;
  customerPhone?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  subtotal: number;
  discount: number;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  invoice?: Invoice;
}

export interface Invoice {
  id: number;
  invoiceCode: string;
  orderId: number;
  orderCode: string;
  customerName?: string;
  paymentMethod: 'CASH' | 'BANKING' | 'MOMO' | 'VNPAY';
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
  amount: number;
  paidAt?: string;
  createdAt: string;
  order?: Order;
}

export interface CreateOrderRequest {
  customerName?: string;
  customerPhone?: string;
  discount?: number;
  items: {
    menuItemId: number;
    quantity: number;
    unitPrice?: number;
    note?: string;
  }[];
}

export interface CreateInvoiceRequest {
  orderId: number;
  paymentMethod: 'CASH' | 'BANKING' | 'MOMO' | 'VNPAY';
}

export interface BankConfig {
  bankId: string;
  bankName: string;
  accountNo: string;
  accountName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
