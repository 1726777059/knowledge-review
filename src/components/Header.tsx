'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg className="w-7 h-7 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-lg md:text-xl font-bold text-gray-900">知识复习</span>
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
            知识库
          </Link>
          <Link href="/review" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
            复习
          </Link>
          <Link href="/import" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
            导入
          </Link>
        </nav>

        {/* 移动端汉堡菜单按钮 */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
          aria-label="菜单"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 移动端下拉菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="max-w-6xl mx-auto px-4 py-3 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              知识库
            </Link>
            <Link
              href="/review"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              复习
            </Link>
            <Link
              href="/import"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              导入
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
