"use client";

import { useState } from "react";

const templates = [
  {
    key: "tech",
    label: "科技青",
    desc: "青色点缀，清爽科技风",
    preview: "border-cyan-500 bg-cyan-50",
    dot: "bg-cyan-500",
  },
  {
    key: "card",
    label: "卡片白",
    desc: "圆角卡片，现代简约",
    preview: "border-gray-200 bg-gray-50",
    dot: "bg-gray-400",
  },
  {
    key: "navy",
    label: "商务蓝",
    desc: "深蓝头部，稳重专业",
    preview: "border-indigo-900 bg-[#1e3a5f]",
    dot: "bg-indigo-400",
  },
];

export function ResumeTemplateSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async (templateKey: string) => {
    setIsGenerating(true);
    setIsOpen(false);

    try {
      const response = await fetch(`/api/resume/pdf?template=${templateKey}`);

      if (!response.ok) {
        throw new Error("生成 PDF 失败");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `陈子龙-前端开发工程师-简历-${templateKey}-${new Date().getFullYear()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("下载 PDF 失败:", error);
      alert("下载 PDF 失败，请稍后重试或使用浏览器打印功能（Ctrl/Cmd + P）");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isGenerating}
        className="rounded-lg bg-gray-900 px-6 py-2 text-white transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
      >
        {isGenerating ? "生成中..." : "下载简历"}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                选择简历模板
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <div className="space-y-3">
              {templates.map((t) => (
                <button
                  key={t.key}
                  onClick={() => handleDownload(t.key)}
                  className="flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-cyan-300 hover:bg-cyan-50/50 dark:border-gray-700 dark:hover:border-cyan-500 dark:hover:bg-gray-700/50"
                >
                  <div
                    className={`h-16 w-12 shrink-0 rounded-lg border-2 ${t.preview} flex items-center justify-center`}
                  >
                    <span className={`h-2 w-2 rounded-full ${t.dot}`} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {t.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {t.desc}
                    </div>
                  </div>
                  <div className="ml-auto text-cyan-600 dark:text-cyan-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  </div>
                </button>
              ))}
            </div>

            <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
              点击模板即可下载对应样式的 PDF 简历
            </p>
          </div>
        </div>
      )}
    </>
  );
}
