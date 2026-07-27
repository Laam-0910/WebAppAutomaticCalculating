import React, { useState, useMemo } from 'react';
import { MenuItem } from '../types';
import { MenuItemCard } from './MenuItemCard';
import { Search, Utensils, X } from 'lucide-react';

interface MenuGridProps {
  items: MenuItem[];
  cartItemCounts: Record<number, number>;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (menuItemId: number, quantity: number) => void;
  onUpdatePrice?: (menuItemId: number, newPrice: number) => void;
}

const CATEGORIES = [
  { key: 'ALL', label: 'TẤT CẢ', icon: '📋' },
  { key: 'MI', label: 'MÌ TRỘN', icon: '🍜' },
  { key: 'XUC_XICH', label: 'XÚC XÍCH', icon: '🌭' },
  { key: 'GA', label: 'GÀ RÁN', icon: '🍗' },
  { key: 'XIEN', label: 'XIÊN QUE', icon: '🍢' },
  { key: 'KHAC', label: 'MÓN KHÁC', icon: '🍔' },
  { key: 'NUOC_GIAI_KHAT', label: 'NƯỚC UỐNG', icon: '🥤' },
];

const CATEGORY_SECTION_TITLES: Record<string, string> = {
  MI: '🍜 MÌ TRỘN',
  XUC_XICH: '🌭 MỤC: XÚC XÍCH',
  GA: '🍗 GÀ RÁN',
  XIEN: '🍢 XIÊN QUE',
  KHAC: '🍔 MÓN KHÁC',
  NUOC_GIAI_KHAT: '🥤 NƯỚC GIẢI KHÁT',
};

export const MenuGrid: React.FC<MenuGridProps> = ({
  items,
  cartItemCounts,
  onAddToCart,
  onUpdateQuantity,
  onUpdatePrice,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCategoryCollapsed, setIsCategoryCollapsed] = useState<boolean>(false);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchCategory && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  // Group items by category for section layout
  const groupedSections = useMemo(() => {
    const categoriesOrder = ['MI', 'XUC_XICH', 'GA', 'XIEN', 'KHAC', 'NUOC_GIAI_KHAT'];
    const groups: { categoryKey: string; title: string; items: MenuItem[] }[] = [];

    categoriesOrder.forEach(catKey => {
      const catItems = filteredItems.filter(i => i.category === catKey);
      if (catItems.length > 0) {
        groups.push({
          categoryKey: catKey,
          title: CATEGORY_SECTION_TITLES[catKey] || catKey,
          items: catItems
        });
      }
    });

    return groups;
  }, [filteredItems]);

  const activeCategoryObj = CATEGORIES.find(c => c.key === selectedCategory) || CATEGORIES[0];

  return (
    <div className="space-y-2.5">
      {/* 🟢 1. THANH DANH MỤC DẠNG NGANG THU NHỎ SIÊU GỌN BÊN TRÊN */}
      <div className="bg-white p-1 sm:p-1.5 rounded-xl border border-gray-200 shadow-2xs space-y-1 sticky top-14 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[10px] sm:text-senior-xs font-black text-gray-500 uppercase tracking-wide">
              📂 DANH MỤC:
            </span>
            <span className="bg-red-50 text-red-700 font-black text-[10px] sm:text-senior-xs px-1.5 py-0.2 rounded border border-red-200">
              {activeCategoryObj.icon} {activeCategoryObj.label}
            </span>
          </div>

          {/* Nút bật/tắt RÚT VÀO 1 Ô ↔ XÒE RA NHIỀU MỤC */}
          <button
            type="button"
            onClick={() => setIsCategoryCollapsed(!isCategoryCollapsed)}
            className="px-2 py-0.5 bg-sky-100 hover:bg-sky-200 text-sky-900 font-extrabold text-[10px] rounded-lg border border-sky-300 transition-all cursor-pointer flex items-center gap-0.5"
          >
            {isCategoryCollapsed ? 'Mở rộng 🔽' : 'Rút gọn 🔼'}
          </button>
        </div>

        {/* Danh sách các ô danh mục thu nhỏ gọn gàng */}
        {!isCategoryCollapsed && (
          <div className="flex gap-1 overflow-x-auto pb-0.5 pt-0.5 no-scrollbar scroll-smooth">
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-2 py-1 rounded-lg font-black text-[11px] whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-red-600 text-white border-red-700 shadow-2xs scale-102'
                      : 'bg-gray-50 hover:bg-sky-100 text-gray-800 border-gray-200'
                  }`}
                >
                  <span className="text-[12px]">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 🟢 2. KHUNG TÌM KIẾM THU GỌN VÀ THỰC ĐƠN GRID 3 MÓN 1 HÀNG */}
      <div className="space-y-3">
        {/* Khung Tìm Kiếm Nhỏ Gọn */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Tìm tên món (mì, xúc xích, gà...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1 bg-white border-2 border-gray-300 rounded-xl text-senior-xs text-gray-900 font-bold focus:outline-none focus:border-sky-600 shadow-xs h-8"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Thực đơn phân nhóm — Hàng 3 món hiển thị cùng lúc */}
        {groupedSections.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border-2 border-dashed border-gray-300">
            <Utensils className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-senior-base font-black text-gray-600 mb-1">
              Không tìm thấy món ăn nào!
            </p>
            <p className="text-senior-xs text-gray-500 font-bold">
              Bấm nút "TẤT CẢ" trên thanh danh mục.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedSections.map(section => (
              <div key={section.categoryKey} className="space-y-1.5">
                {/* Header danh mục gọn gàng */}
                <div className="flex items-center justify-between bg-sky-900 text-white px-3 py-1 rounded-xl shadow-xs border border-sky-950">
                  <span className="font-black text-senior-xs tracking-wide uppercase">
                    {section.title}
                  </span>
                  <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                    {section.items.length} món
                  </span>
                </div>

                {/* 🟢 GRID 3 MÓN 1 HÀNG (grid-cols-3) HỢP CHUẨN UX/UI */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {section.items.map(item => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      quantityInCart={cartItemCounts[item.id] || 0}
                      onAddToCart={onAddToCart}
                      onUpdateQuantity={onUpdateQuantity}
                      onUpdatePrice={onUpdatePrice}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};



