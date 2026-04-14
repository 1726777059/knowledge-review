'use client';

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';

interface MasterySliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const MASTERY_LABELS = ['未知', '陌生', '学习中', '熟悉', '掌握', '精通'];

export function MasterySlider({ value, onChange, disabled = false }: MasterySliderProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">掌握程度</label>
        <span className="text-sm text-blue-600 font-medium">
          {MASTERY_LABELS[displayValue]} ({displayValue}/5)
        </span>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            type="button"
            disabled={disabled}
            className={`
              flex-1 h-12 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
              ${level === value 
                ? 'border-blue-500 bg-blue-50 text-blue-600' 
                : level < value 
                  ? 'border-blue-200 bg-blue-100 text-blue-400' 
                  : 'border-gray-200 bg-white text-gray-300 hover:border-blue-300'}
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-blue-400'}
            `}
            onClick={() => onChange(level)}
            onMouseEnter={() => setHoverValue(level)}
            onMouseLeave={() => setHoverValue(null)}
          >
            {level}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>陌生</span>
        <span>精通</span>
      </div>
    </div>
  );
}

interface ImportanceStarsProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function ImportanceStars({ value, onChange, disabled = false }: ImportanceStarsProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">重要程度</label>
        <span className="text-sm text-orange-600 font-medium">{displayValue}/5</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            type="button"
            disabled={disabled}
            className={`
              p-1 transition-transform duration-150
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
            `}
            onClick={() => onChange(level)}
            onMouseEnter={() => setHoverValue(level)}
            onMouseLeave={() => setHoverValue(null)}
          >
            <Star
              size={28}
              className={`
                transition-colors duration-150
                ${level <= displayValue 
                  ? 'fill-orange-400 text-orange-400' 
                  : 'text-gray-300'}
              `}
            />
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>一般</span>
        <span>至关重要</span>
      </div>
    </div>
  );
}

interface ProgressSaveIndicatorProps {
  saving: boolean;
  saved: boolean;
}

export function ProgressSaveIndicator({ saving, saved }: ProgressSaveIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {saving ? (
        <>
          <Loader2 size={16} className="animate-spin text-blue-500" />
          <span className="text-gray-500">保存中...</span>
        </>
      ) : saved ? (
        <>
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-600">已保存</span>
        </>
      ) : null}
    </div>
  );
}