'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit3, Save, X } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { MasterySlider, ImportanceStars, ProgressSaveIndicator } from '@/components/RatingComponents';
import { getKnowledgePoint, updateKnowledgePoint, upsertProgress, recordReview } from '@/lib/api';
import type { KnowledgePointWithProgress } from '@/lib/types';

export default function KnowledgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [knowledge, setKnowledge] = useState<KnowledgePointWithProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} />
          返回知识库
        </Link>
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
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
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
  );
}