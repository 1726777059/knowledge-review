'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Clock, Filter } from 'lucide-react';
import type { ReviewStrategy } from '@/lib/types';

interface StrategySelectorProps {
  current: ReviewStrategy;
  onChange: (strategy: ReviewStrategy) => void;
}

const strategies = [
  { id: 'importance', label: '按重要程度', icon: BarChart3, description: '重要且未掌握的优先' },
  { id: 'forgetting-curve', label: '按遗忘曲线', icon: TrendingUp, description: '上次复习越久越靠前' },
  { id: 'ebbinghaus', label: '艾宾浩斯', icon: Clock, description: '按预设间隔到期复习' },
  { id: 'hybrid', label: '混合策略', icon: Filter, description: '综合重要性+遗忘+间隔' },
] as const;

export function StrategySelector({ current, onChange }: StrategySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentStrategy = strategies.find(s => s.id === current);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
      >
        {currentStrategy && <currentStrategy.icon size={18} className="text-blue-600" />}
        <span className="font-medium">{currentStrategy?.label}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
            {strategies.map(strategy => (
              <button
                key={strategy.id}
                onClick={() => {
                  onChange(strategy.id as ReviewStrategy);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-start gap-3 p-3 text-left hover:bg-gray-50 transition-colors
                  ${strategy.id === current ? 'bg-blue-50' : ''}
                `}
              >
                <strategy.icon size={20} className={strategy.id === current ? 'text-blue-600' : 'text-gray-400'} />
                <div>
                  <div className={`font-medium ${strategy.id === current ? 'text-blue-600' : 'text-gray-900'}`}>
                    {strategy.label}
                  </div>
                  <div className="text-sm text-gray-500">{strategy.description}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface StatsCardProps {
  label: string;
  value: number;
  color: string;
}

export function StatsCard({ label, value, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}