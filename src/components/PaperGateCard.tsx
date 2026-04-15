'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GraduationCap, AlertTriangle } from 'lucide-react';
import { getPaperStatistics } from '@/lib/api';

export function PaperGateCard() {
  const [stats, setStats] = useState({ total: 24, completed: 0, weakCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPaperStatistics();
        setStats(data);
      } catch (error) {
        console.error('加载论文闯关进度失败:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const progressPercent = (stats.completed / stats.total) * 100;

  return (
    <Link href="/paper" className="block">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <GraduationCap size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">论文场景闯关</h3>
              <p className="text-white/70 text-sm">24个论文主题场景练习</p>
            </div>
          </div>
          {stats.weakCount > 0 && (
            <div className="flex items-center gap-1 text-amber-300 text-sm">
              <AlertTriangle size={16} />
              <span>{stats.weakCount}个薄弱点</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>进度</span>
            <span>{stats.completed}/{stats.total} 关</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
