import { Suspense } from 'react';
import { getAllKnowledgePoints } from '@/lib/api';
import KnowledgeDetailClient from './KnowledgeDetailClient';

function LoadingFallback() {
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

// 静态导出需要：生成所有知识点 ID
// 构建时环境变量不可用，返回空数组
export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Supabase URL 未配置，跳过静态生成');
    return [];
  }
  try {
    const points = await getAllKnowledgePoints();
    return points.map(point => ({
      id: point.id,
    }));
  } catch (error) {
    console.error('生成静态参数失败:', error);
    return [];
  }
}

export default function KnowledgeDetailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <KnowledgeDetailClient />
    </Suspense>
  );
}