import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { CacheProvider } from "@/components/CacheProvider";

export const metadata: Metadata = {
  title: "知识复习系统",
  description: "个人知识管理系统，支持知识点标记和复习策略",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50">
        <CacheProvider />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 py-4 mt-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
            知识复习系统 · 基于记忆曲线设计
          </div>
        </footer>
      </body>
    </html>
  );
}
