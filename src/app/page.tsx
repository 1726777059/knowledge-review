'use client';

import { useState, useEffect, useMemo } from 'react';
import { KnowledgeCard } from '@/components/KnowledgeCard';
import { StrategySelector, StatsCard } from '@/components/ReviewComponents';
import { EmptyState } from '@/components/MarkdownRenderer';
import { Search, Sparkles, BookOpen } from 'lucide-react';
import type { KnowledgePointWithProgress, ReviewStrategy } from '@/lib/types';
import { getAllKnowledgePoints, getStatistics } from '@/lib/api';
import Fuse from 'fuse.js';
import Link from 'next/link';

export default function HomePage() {
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePointWithProgress[]>([]);
  const [stats, setStats] = useState({ total: 0, mastered: 0, learning: 0, notStarted: 0, dueReview: 0 });
  const [loading, setLoading] = useState(true);
  const [strategy, setStrategy] = useState<ReviewStrategy>('hybrid');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [points, statistics] = await Promise.all([
        getAllKnowledgePoints(),
        getStatistics()
      ]);
      setKnowledgePoints(points);
      setStats(statistics);
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  }

  // 创建 Fuse 实例用于模糊搜索
  const fuse = useMemo(() => {
    return new Fuse(knowledgePoints, {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'tags', weight: 0.3 },
        { name: 'content', weight: 0.2 }
      ],
      threshold: 0.4, // 模糊度，值越小越精确
      includeScore: true,
      minMatchCharLength: 2, // 最少输入2个字符开始匹配
    });
  }, [knowledgePoints]);

  // 模糊搜索结果
  const filteredPoints = useMemo(() => {
    if (!searchQuery.trim()) {
      return knowledgePoints;
    }
    const results = fuse.search(searchQuery);
    return results.map(result => result.item);
  }, [searchQuery, fuse, knowledgePoints]);

  const sortedPoints = [...filteredPoints].sort((a, b) => {
    switch (strategy) {
      case 'importance':
        const impA = a.user_progress?.importance_level ?? 3;
        const impB = b.user_progress?.importance_level ?? 3;
        if (impB !== impA) return impB - impA;
        return (a.user_progress?.mastery_level ?? 0) - (b.user_progress?.mastery_level ?? 0);
      case 'forgetting-curve':
        const lastA = a.user_progress?.last_reviewed_at || '1970-01-01';
        const lastB = b.user_progress?.last_reviewed_at || '1970-01-01';
        return lastA.localeCompare(lastB);
      case 'hybrid':
      default:
        const scoreA = ((a.user_progress?.importance_level ?? 3) / 5) * 0.3 +
          (1 - (a.user_progress?.mastery_level ?? 0) / 5) * 0.4 +
          ((Date.now() - new Date(a.user_progress?.last_reviewed_at || a.created_at).getTime()) / (1000 * 60 * 60 * 24)) * 0.3 / 30;
        const scoreB = ((b.user_progress?.importance_level ?? 3) / 5) * 0.3 +
          (1 - (b.user_progress?.mastery_level ?? 0) / 5) * 0.4 +
          ((Date.now() - new Date(b.user_progress?.last_reviewed_at || b.created_at).getTime()) / (1000 * 60 * 60 * 24)) * 0.3 / 30;
        return scoreB - scoreA;
    }
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">知识库</h1>
          <p className="text-gray-500 text-sm mt-1">共 {stats.total} 个知识点</p>
        </div>
        <StrategySelector current={strategy} onChange={setStrategy} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatsCard label="总计" value={stats.total} color="#3b82f6" />
        <StatsCard label="已掌握" value={stats.mastered} color="#22c55e" />
        <StatsCard label="学习中" value={stats.learning} color="#f59e0b" />
        <StatsCard label="待复习" value={stats.dueReview} color="#ef4444" />
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="输入关键词快速搜索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex justify-end mb-4">
        <Link
          href="/browse"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <BookOpen size={18} />
          <span>卡片浏览模式</span>
        </Link>
      </div>

      {sortedPoints.length === 0 ? (
        <EmptyState message={searchQuery ? '未找到匹配的知识点' : '还没有知识点，去导入一些吧'} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPoints.map(point => (
            <KnowledgeCard
              key={point.id}
              id={point.id}
              title={point.title}
              tags={point.tags || []}
              mastery_level={point.user_progress?.mastery_level ?? 0}
              importance_level={point.user_progress?.importance_level ?? 3}
              last_reviewed_at={point.user_progress?.last_reviewed_at ?? null}
              next_review_at={point.user_progress?.next_review_at ?? null}
              created_at={point.created_at}
              preview={point.content.slice(0, 100)}
            />
          ))}
        </div>
      )}
    </div>
  );
}