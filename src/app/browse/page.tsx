'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Filter, LayoutGrid } from 'lucide-react';
import { KnowledgeCard } from '@/components/KnowledgeCard';
import { EmptyState } from '@/components/MarkdownRenderer';
import { getAllKnowledgePoints } from '@/lib/api';
import type { KnowledgePointWithProgress } from '@/lib/types';
import Fuse from 'fuse.js';

export default function BrowsePage() {
  const router = useRouter();
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePointWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagFilterOpen, setTagFilterOpen] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadData(silent = false) {
    try {
      if (!silent) setLoading(true);
      const data = await getAllKnowledgePoints();
      setKnowledgePoints(data);
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    knowledgePoints.forEach(point => {
      (point.tags || []).forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [knowledgePoints]);

  const fuse = useMemo(() => {
    return new Fuse(knowledgePoints, {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'tags', weight: 0.3 },
        { name: 'content', weight: 0.2 }
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [knowledgePoints]);

  const filteredPoints = useMemo(() => {
    let results = knowledgePoints;

    if (searchQuery.trim()) {
      results = fuse.search(searchQuery).map(result => result.item);
    }

    if (selectedTag) {
      results = results.filter(point => (point.tags || []).includes(selectedTag));
    }

    return results;
  }, [searchQuery, selectedTag, fuse, knowledgePoints]);

  // 跳转到卡片详情，携带当前列表上下文
  const handleCardClick = (point: KnowledgePointWithProgress, index: number) => {
    const ids = filteredPoints.map(p => p.id).join(',');
    router.push(`/knowledge/${point.id}?ids=${ids}&index=${index}`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} />
          返回知识库
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">卡片浏览模式</h1>
          <p className="text-gray-500 text-sm mt-1">共 {filteredPoints.length} 个知识点</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="输入关键词快速搜索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {allTags.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedTag === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setTagFilterOpen(!tagFilterOpen)}
            className="ml-2 inline-flex items-center gap-1 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Filter size={14} />
            标签筛选
            {tagFilterOpen ? '▲' : '▼'}
          </button>
          {tagFilterOpen && (
            <div className="flex flex-wrap gap-2 mt-3">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTag === tag
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {filteredPoints.length === 0 ? (
        <EmptyState message={searchQuery || selectedTag ? '未找到匹配的知识点' : '还没有知识点'} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPoints.map((point, index) => (
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
              onClick={() => handleCardClick(point, index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
