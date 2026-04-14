'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit3, Save, X, ChevronLeft, ChevronRight, List, Tag } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { MasterySlider, ImportanceStars, ProgressSaveIndicator } from '@/components/RatingComponents';
import { getKnowledgePoint, updateKnowledgePoint, upsertProgress, recordReview } from '@/lib/api';
import type { KnowledgePointWithProgress } from '@/lib/types';

export default function KnowledgeDetailClient() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const [knowledge, setKnowledge] = useState<KnowledgePointWithProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  // 从 URL 获取列表上下文
  const cardIds = useMemo(() => {
    const ids = searchParams.get('ids');
    return ids ? ids.split(',') : [];
  }, [searchParams]);

  const currentIndex = useMemo(() => {
    const idx = searchParams.get('index');
    return idx ? parseInt(idx, 10) : 0;
  }, [searchParams]);

  // 是否有列表上下文
  const hasListContext = cardIds.length > 0;

  useEffect(() => {
    loadKnowledge();
  }, [id]);

  async function loadKnowledge() {
    try {
      const data = await getKnowledgePoint(id);
      setKnowledge(data);
      if (data) {
        setEditContent(data.content);
        setEditTitle(data.title);
      }
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleMasteryChange = useCallback(async (value: number) => {
    if (!knowledge) return;
    setSaving(true);
    setSaved(false);
    try {
      await recordReview(knowledge.id, value);
      await loadKnowledge();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setSaving(false);
    }
  }, [knowledge]);

  const handleImportanceChange = useCallback(async (value: number) => {
    if (!knowledge) return;
    setSaving(true);
    setSaved(false);
    try {
      await upsertProgress(knowledge.id, { importance_level: value });
      await loadKnowledge();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setSaving(false);
    }
  }, [knowledge]);

  const handleSaveContent = async () => {
    if (!knowledge) return;
    setSaving(true);
    try {
      await updateKnowledgePoint(knowledge.id, {
        title: editTitle,
        content: editContent
      });
      await loadKnowledge();
      setIsEditing(false);
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    if (knowledge) {
      setEditTitle(knowledge.title);
      setEditContent(knowledge.content);
    }
    setIsEditing(false);
  };

  // 跳转到上一个/下一个
  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newId = cardIds[newIndex];
      router.push(`/knowledge/${newId}?ids=${cardIds.join(',')}&index=${newIndex}`);
    }
  }, [currentIndex, cardIds, router]);

  const goToNext = useCallback(() => {
    if (currentIndex < cardIds.length - 1) {
      const newIndex = currentIndex + 1;
      const newId = cardIds[newIndex];
      router.push(`/knowledge/${newId}?ids=${cardIds.join(',')}&index=${newIndex}`);
    }
  }, [currentIndex, cardIds, router]);

  const goToCard = useCallback((targetId: string, targetIndex: number) => {
    router.push(`/knowledge/${targetId}?ids=${cardIds.join(',')}&index=${targetIndex}`);
  }, [cardIds, router]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing) return;
      if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
        goToPrev();
      } else if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
        goToNext();
      } else if (e.key === 'Escape') {
        router.push('/browse');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext, isEditing, router]);

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!knowledge) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">知识点未找到</h2>
        <Link href="/" className="text-blue-600 hover:underline">返回知识库</Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 侧边答题卡式序号列表 */}
      {showSidebar && hasListContext && (
        <div className="w-40 border-r border-gray-200 bg-gray-50 overflow-y-auto shrink-0">
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-3 py-2 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">答题卡</h3>
                <p className="text-xs text-gray-500">
                  {currentIndex + 1} / {cardIds.length}
                </p>
              </div>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="隐藏"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-4 gap-1.5">
              {cardIds.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToCard(cardIds[idx], idx)}
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-colors ${
                    idx === currentIndex
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="max-w-4xl mx-auto w-full px-4 py-6 overflow-y-auto flex-1">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href={hasListContext ? '/browse' : '/'}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={20} />
              {hasListContext ? '返回浏览' : '返回知识库'}
            </Link>
            {hasListContext && !showSidebar && (
              <button
                onClick={() => setShowSidebar(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <List size={18} />
                显示列表
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-2xl font-bold border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={15}
                    className="w-full font-mono text-sm border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center justify-between">
                    <button
                      onClick={cancelEdit}
                      className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <X size={18} />
                      取消
                    </button>
                    <button
                      onClick={handleSaveContent}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Save size={18} />
                      保存修改
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{knowledge.title}</h1>
                    {knowledge.tags && knowledge.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {knowledge.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors shrink-0"
                  >
                    <Edit3 size={18} />
                    编辑
                  </button>
                </div>
              )}
            </div>

            <div className="p-6">
              <MarkdownRenderer content={knowledge.content} />
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <MasterySlider
                    value={knowledge.user_progress?.mastery_level ?? 0}
                    onChange={handleMasteryChange}
                  />
                </div>
                <div className="flex-1">
                  <ImportanceStars
                    value={knowledge.user_progress?.importance_level ?? 3}
                    onChange={handleImportanceChange}
                  />
                </div>
                <div className="shrink-0">
                  <ProgressSaveIndicator saving={saving} saved={saved} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
            <span>
              来源: {knowledge.source_file || '未知'}
            </span>
            <span>
              创建于: {new Date(knowledge.created_at).toLocaleDateString('zh-CN')}
            </span>
          </div>
        </div>

        {/* 底部翻页栏 */}
        {hasListContext && (
          <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-3">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <button
                onClick={goToPrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
                上一个
              </button>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  按 ← → 或 N P 键切换
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(cardIds.length, 10) }).map((_, i) => {
                    const idx = Math.max(0, currentIndex - 4) + i;
                    if (idx >= cardIds.length) return null;
                    return (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          idx === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    );
                  })}
                  {cardIds.length > 10 && (
                    <span className="text-xs text-gray-400 ml-1">
                      +{cardIds.length - 10}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={goToNext}
                disabled={currentIndex === cardIds.length - 1}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                下一个
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
