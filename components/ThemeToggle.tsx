"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 dark:border-white dark:bg-gray-800 dark:text-white">
        💻
      </div>
    );
  }

  const handleToggle = () => {
    const currentTheme = theme || "system";
    console.log("当前主题:", currentTheme, "解析主题:", resolvedTheme);

    if (currentTheme === "light") {
      console.log("切换到: dark");
      setTheme("dark");
    } else if (currentTheme === "dark") {
      console.log("切换到: system");
      setTheme("system");
    } else {
      console.log("切换到: light");
      setTheme("light");
    }

    // 延迟检查 HTML 元素
    setTimeout(() => {
      const htmlElement = document.documentElement;
      console.log("HTML class:", htmlElement.className);
      console.log("是否有 dark class:", htmlElement.classList.contains("dark"));
    }, 100);
  };

  const getIcon = () => {
    const currentTheme = theme || "system";
    if (currentTheme === "system") {
      return "💻";
    }
    if (resolvedTheme === "dark") {
      return "🌙";
    }
    return "☀️";
  };

  return (
    <button
      onClick={handleToggle}
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
      aria-label="切换主题"
      type="button"
    >
      {getIcon()}
    </button>
  );
}

