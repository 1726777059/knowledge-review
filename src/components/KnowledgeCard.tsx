'use client';

import Link from 'next/link';
import { Clock, Calendar, Eye, Tag } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface KnowledgeCardProps {
  id: string;
  title: string;
  tags: string[];
  mastery_level: number;
  importance_level: number;
  last_reviewed_at: string | null;
  next_review_at: string | null;
  created_at: string;
  preview?: string;
}

export function KnowledgeCard({
  id,
  title,
  tags,
  mastery_level,
  importance_level,
  last_reviewed_at,
  next_review_at,
  created_at,
  preview
}: KnowledgeCardProps) {
  const isDue = next_review_at && new Date(next_review_at) <= new Date();

  return (
    <Link href={`/knowledge/${id}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-sm ${i < importance_level ? 'text-orange-400' : 'text-gray-200'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {preview && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{preview}</p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 4).map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="text-xs text-gray-400">+{tags.length - 4}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${mastery_level >= 4 ? 'bg-green-500' : mastery_level > 0 ? 'bg-yellow-500' : 'bg-gray-300'}`} />
              {mastery_level >= 4 ? '掌握' : mastery_level > 0 ? '学习中' : '未学'}
            </span>
            {last_reviewed_at && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {formatDistanceToNow(new Date(last_reviewed_at), { locale: zhCN, addSuffix: true })}
              </span>
            )}
          </div>
          {isDue && (
            <span className="flex items-center gap-1 text-red-500 font-medium">
              <Calendar size={12} />
              待复习
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {format(new Date(created_at), 'MM/dd')}
          </span>
        </div>
      </div>
    </Link>
  );
}