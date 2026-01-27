"use client";

import { useState } from 'react';

export function DownloadPDFButton() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);

    try {
      // 调用 API 生成 PDF
      const response = await fetch('/api/resume/pdf');

      if (!response.ok) {
        throw new Error('生成 PDF 失败');
      }

      // 获取 PDF blob
      const blob = await response.blob();

      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `陈灼-前端工程师-简历-${new Date().getFullYear()}.pdf`;
      document.body.appendChild(a);
      a.click();

      // 清理
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('下载 PDF 失败:', error);
      alert('下载 PDF 失败，请稍后重试或使用浏览器打印功能（Ctrl/Cmd + P）');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownloadPDF}
      disabled={isGenerating}
      className="rounded-lg bg-gray-900 px-6 py-2 text-white transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
      title="下载简历 PDF"
    >
      {isGenerating ? '生成中...' : '下载 PDF'}
    </button>
  );
}
