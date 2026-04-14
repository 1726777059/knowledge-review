'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, FileText, Copy, Check, Download } from 'lucide-react';

export default function ImportPage() {
  const [mdContent, setMdContent] = useState('');
  const [generatedSql, setGeneratedSql] = useState('');
  const [copied, setCopied] = useState(false);

  const generateSql = () => {
    if (!mdContent.trim()) return;
    
    try {
      const sql = parseMarkdownToSql(mdContent);
      setGeneratedSql(sql);
    } catch (error) {
      setGeneratedSql('解析失败: ' + (error as Error).message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSql = () => {
    const blob = new Blob([generatedSql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'knowledge_import.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} />
          返回知识库
        </Link>
      </div>

      <div className="text-center mb-8">
        <Upload size={64} className="mx-auto text-blue-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">导入知识点</h1>
        <p className="text-gray-500">将 Markdown 内容转换为数据库 SQL 语句</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={20} className="text-blue-600" />
            <h2 className="font-semibold text-gray-900">Markdown 内容</h2>
          </div>
          <textarea
            value={mdContent}
            onChange={(e) => setMdContent(e.target.value)}
            placeholder={`# 标题

内容正文...

| 列1 | 列2 |
|-----|-----|
| 值1 | 值2 |

![图片描述](图片路径.png)

\`\`\`标签1\`\`\` \`标签2\``}
            className="w-full h-80 font-mono text-sm border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-green-600" />
              <h2 className="font-semibold text-gray-900">生成的 SQL</h2>
            </div>
            {generatedSql && (
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  {copied ? '已复制' : '复制'}
                </button>
                <button
                  onClick={downloadSql}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Download size={16} />
                  下载
                </button>
              </div>
            )}
          </div>
          <textarea
            value={generatedSql}
            readOnly
            placeholder="生成的 SQL 将显示在这里..."
            className="w-full h-80 font-mono text-sm border border-gray-200 rounded-xl p-4 bg-gray-50 resize-none"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={generateSql}
          disabled={!mdContent.trim()}
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload size={24} />
          生成 SQL
        </button>
      </div>

      <div className="mt-8 bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-medium mb-2">使用说明：</p>
        <ol className="list-decimal list-inside space-y-1 text-blue-700">
          <li>在左侧粘贴你的 Markdown 格式知识内容</li>
          <li>点击「生成 SQL」按钮，系统会自动解析生成 SQL 语句</li>
          <li>复制或下载生成的 SQL，到 Supabase SQL 编辑器执行</li>
          <li>执行完成后刷新知识库页面即可看到新导入的内容</li>
        </ol>
      </div>
    </div>
  );
}

function parseMarkdownToSql(markdown: string): string {
  const lines = markdown.split('\n');
  let title = '';
  let content: string[] = [];
  const tags: string[] = [];
  const images: string[] = [];

  for (const line of lines) {
    if (!title && line.startsWith('# ')) {
      title = line.substring(2).trim();
      continue;
    }

    const tripleBacktickRegex = /`{3}([^`]+?)`{3}/g;
    const tagMatches = line.match(tripleBacktickRegex);
    if (tagMatches) {
      tagMatches.forEach(match => {
        const tag = match.replace(/```/g, '').trim();
        if (tag && !tags.includes(tag)) {
          tags.push(tag);
        }
      });
    }

    const tagInBackticks = line.match(/`([^`]+)`/g);
    if (tagInBackticks) {
      tagInBackticks.forEach(match => {
        const tag = match.replace(/`/g, '').trim();
        if (tag && tag.length < 20 && !tags.includes(tag)) {
          tags.push(tag);
        }
      });
    }

    const imageMatches = line.match(/!\[([^\]]*)\]\(([^)]+)\)/g);
    if (imageMatches) {
      imageMatches.forEach(match => {
        const urlMatch = match.match(/\]\(([^)]+)\)/);
        if (urlMatch) {
          images.push(urlMatch[1]);
        }
      });
    }

    content.push(line);
  }

  if (!title) {
    title = '未命名知识点';
  }

  const escapedContent = content.join('\n')
    .replace(/'/g, "''")
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n');

  const escapedTitle = title.replace(/'/g, "''");

  const tagsArray = tags.length > 0 ? `ARRAY[${tags.map(t => `'${t.replace(/'/g, "''")}'`).join(', ')}]::text[]` : 'ARRAY[]::text[]';
  const imagesArray = images.length > 0 ? `ARRAY[${images.map(i => `'${i.replace(/'/g, "''")}'`).join(', ')}]::text[]` : 'ARRAY[]::text[]';

  return `INSERT INTO knowledge_points (title, content, tags, images, source_file)
VALUES (
  '${escapedTitle}',
  '${escapedContent}',
  ${tagsArray},
  ${imagesArray},
  'imported.md'
);`;
}