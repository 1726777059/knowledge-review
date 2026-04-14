import { getAllKnowledgePoints } from '@/lib/api';
import KnowledgeDetailClient from './KnowledgeDetailClient';

// 静态导出需要：生成所有知识点 ID
export async function generateStaticParams() {
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