import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove?: () => void;
  size?: 'small' | 'normal' | 'large';
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
  size = 'large',
}) => {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  if (isSmall) {
    return (
      <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-300 w-full justify-between">
        {quantity === 1 && onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="p-1 bg-red-100 text-red-700 hover:bg-red-200 active:scale-95 rounded transition-all font-bold flex items-center justify-center border border-red-300 min-w-[28px] min-h-[28px]"
            title="Xóa món"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onDecrease}
            className="p-1 bg-white text-gray-800 hover:bg-gray-200 active:scale-95 rounded shadow-xs font-extrabold flex items-center justify-center border border-gray-300 min-w-[28px] min-h-[28px]"
            title="Giảm 1"
          >
            <Minus className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        )}

        <span className="font-black text-gray-900 text-senior-xs px-1">
          {quantity}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          className="p-1 bg-sky-600 text-white hover:bg-sky-700 active:scale-95 rounded shadow-xs font-extrabold flex items-center justify-center min-w-[28px] min-h-[28px]"
          title="Tăng 1"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl border border-gray-300">
      {quantity === 1 && onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="p-3 bg-red-100 text-red-700 hover:bg-red-200 active:scale-95 rounded-lg transition-all font-bold flex items-center justify-center border border-red-300"
          title="Xóa món này"
          aria-label="Xóa món này"
        >
          <Trash2 className={isLarge ? 'w-6 h-6' : 'w-5 h-5'} />
        </button>
      ) : (
        <button
          type="button"
          onClick={onDecrease}
          className="p-3 bg-white text-gray-800 hover:bg-gray-200 active:scale-95 rounded-lg shadow-sm font-extrabold flex items-center justify-center border border-gray-300 min-w-[48px] min-h-[48px]"
          title="Giảm 1"
          aria-label="Giảm 1"
        >
          <Minus className={isLarge ? 'w-6 h-6 stroke-[3]' : 'w-5 h-5 stroke-[3]'} />
        </button>
      )}

      <span className="min-w-[40px] text-center font-extrabold text-gray-900 text-senior-xl">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        className="p-3 bg-sky-600 text-white hover:bg-sky-700 active:scale-95 rounded-lg shadow-sm font-extrabold flex items-center justify-center min-w-[48px] min-h-[48px]"
        title="Tăng 1"
        aria-label="Tăng 1"
      >
        <Plus className={isLarge ? 'w-6 h-6 stroke-[3]' : 'w-5 h-5 stroke-[3]'} />
      </button>
    </div>
  );
};

