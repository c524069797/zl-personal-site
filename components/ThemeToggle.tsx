"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "antd";
import { MoonOutlined, SunOutlined, DesktopOutlined } from "@ant-design/icons";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Avoid synchronous setState warning
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, []);

  if (!mounted) {
    return (
      <Button icon={<DesktopOutlined />} type="text" />
    );
  }

  const handleToggle = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  };

  return (
    <Button
      type="text"
      icon={resolvedTheme === 'dark' ? <MoonOutlined /> : <SunOutlined />}
      onClick={handleToggle}
      title={resolvedTheme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
    />
  );
}

