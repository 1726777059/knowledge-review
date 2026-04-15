'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, CheckCircle2, RotateCcw, BookOpen } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { MasterySlider, ImportanceStars } from '@/components/RatingComponents';
import { StrategySelector, StatsCard } from '@/components/ReviewComponents';
import { getReviewQueue, recordReview, getStatistics } from '@/lib/api';
import type { KnowledgePointWithProgress, ReviewStrategy } from '@/lib/types';

export default function ReviewPage() {
  const router = useRouter();
  const [points, setPoints] = useState<KnowledgePointWithProgress[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({ total: 0, mastered: 0, learning: 0, notStarted: 0, dueReview: 0 });
  const [strategy, setStrategy] = useState<ReviewStrategy>('ebbinghaus');
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 首次加载后每30秒自动刷新一次
    const interval = setInterval(() => {
      loadQueue(true);
      loadStats(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [strategy]);

  async function loadQueue(silent = false) {
    try {
      if (!silent) setLoading(true);
      const data = await getReviewQueue(strategy);
      setPoints(data);
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  async function loadStats(silent = false) {
    try {
      const data = await getStatistics();
      setStats(data);
    } catch (error) {
      console.error('加载失败:', error);
    }
  }

  const startReview = () => {
    setCurrentIndex(0);
    setReviewedCount(0);
    setIsReviewing(true);
  };

  const handleReviewComplete = async (mastery: number) => {
    if (!points[currentIndex]) return;
    
    try {
      await recordReview(points[currentIndex].id, mastery);
      setReviewedCount(prev => prev + 1);
      
      if (currentIndex < points.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsReviewing(false);
        loadQueue();
        loadStats();
      }
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  const currentPoint = points[currentIndex];

  if (!isReviewing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft size={20} />
            返回知识库
          </Link>
        </div>

        <div className="text-center mb-8">
          <BookOpen size={64} className="mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">复习模式</h1>
          <p className="text-gray-500">选择复习策略，开始今日的学习</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatsCard label="总知识点" value={stats.total} color="#3b82f6" />
          <StatsCard label="已掌握" value={stats.mastered} color="#22c55e" />
          <StatsCard label="学习中" value={stats.learning} color="#f59e0b" />
          <StatsCard label="待复习" value={stats.dueReview} color="#ef4444" />
        </div>

        <div className="flex justify-center mb-8">
          <StrategySelector current={strategy} onChange={setStrategy} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {points.length} 个知识点待复习
          </h2>
          <p className="text-gray-500 mb-6">
            {strategy === 'ebbinghaus' && '按艾宾浩斯��忘曲线安排复习'}
            {strategy === 'importance' && '按重要程度优先复习'}
            {strategy === 'forgetting-curve' && '按上次复习时间排序'}
            {strategy === 'hybrid' && '综合多种策略智能排序'}
          </p>
          <button
            onClick={startReview}
            disabled={points.length === 0}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={24} />
            开始复习
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-500">
          进度: {currentIndex + 1} / {points.length} (已复习 {reviewedCount})
        </div>
        <button
          onClick={() => setIsReviewing(false)}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <RotateCcw size={18} />
          结束复习
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{currentPoint.title}</h2>
        </div>

        <div className="p-6">
          <MarkdownRenderer content={currentPoint.content} />
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="text-sm text-gray-500">评估掌握程度:</div>
            {[0, 1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                onClick={() => handleReviewComplete(level)}
                className={`
                  w-12 h-12 rounded-lg border-2 font-bold transition-all
                  ${level >= 4 ? 'border-green-500 bg-green-50 text-green-600 hover:bg-green-100' : ''}
                  ${level === 3 ? 'border-yellow-500 bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : ''}
                  ${level < 3 ? 'border-gray-200 bg-white text-gray-400 hover:border-gray-300' : ''}
                `}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>陌生</span>
            <span>学习中</span>
            <span>掌握</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return <a href={href} className={className}>{children}</a>;
}