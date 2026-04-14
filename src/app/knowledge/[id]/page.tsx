import { getAllKnowledgePoints } from '@/lib/api';
import KnowledgeDetailClient from './KnowledgeDetailClient';

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
  return <KnowledgeDetailClient />;
}