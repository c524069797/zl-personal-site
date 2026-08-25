import { Fragment, type ReactNode } from "react";

/**
 * 把 `**加粗**` 标记渲染成 <strong>。
 *
 * 简历文案里只需要「整段常规 + 关键词加粗」这一种强调，
 * 引一个 Markdown 渲染器不划算，这里按 ** 成对切分即可。
 */
export function renderRich(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** 去掉加粗标记，供纯文本场景（如导出 md 之外的地方）使用 */
export function stripRich(text: string): string {
  return text.replace(/\*\*/g, "");
}
