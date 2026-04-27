---
title: "TypeScript实战：类型系统在投资助手项目中的工程化应用"
summary: "分享在AI投资助手项目中积累的TypeScript实践经验，涵盖泛型设计、类型收窄、字面量联合类型、类型谓词等核心技巧，以及strict模式下常见的踩坑点。"
date: "2026-03-18"
tags: ["TypeScript", "类型系统", "工程化", "前端开发"]
category: "tech"
---

## 一、为什么在这个项目里TypeScript特别重要

AI投资助手这个项目涉及多数据源拼接（东方财富、腾讯财经）、AI SDK类型对接、以及大量数值计算（技术指标）。如果没有类型约束，很容易在以下场景翻车：

- 不同API返回的字段名不一致（如"changePercent" vs "f3"）
- AI SDK的消息协议和UI消息协议混用
- 技术指标计算中出现undefined导致NaN
- 市场代码"1"和"0"被当成字符串还是数字

TypeScript的strict模式在这个项目里不是可选项，而是必需品。

---

## 二、泛型接口：一个壳子服务所有API响应

项目里所有后端API都返回统一的响应结构：

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

`T`是泛型参数，data可以是股票数组、K线数据、会话列表等任意类型。上层调用时显式指定：

```typescript
// 获取会话列表
const sessions = await fetchJson<ChatSessionSummary[]>("/api/chat/sessions");

// 获取消息记录
const messages = await fetchJson<ChatMessageRecord[]>("/api/chat/messages");
```

fetcher函数也用泛型：

```typescript
const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  const json: ApiResponse<T> = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.error ?? "Failed to fetch");
  }
  return json.data;
};
```

这样一套fetcher服务了所有SWR hook，不用为每种数据类型写重复的请求逻辑。

---

## 三、字面量联合类型：防止role被拼错

聊天消息的角色只有三种可能：

```typescript
interface ChatMessageRecord {
  role: "user" | "assistant" | "system";
  content: string;
}
```

用字面量联合类型而不是`string`，可以在编译期就拦住`role: "assistent"`（拼写错误）。

在协议转换时，用`as const`确保类型收窄：

```typescript
function convertMessages(messages: IncomingMessage[]) {
  return messages.map((msg) => {
    const content = extractContent(msg);
    if (msg.role === "user") return { role: "user" as const, content };
    if (msg.role === "system") return { role: "system" as const, content };
    return { role: "assistant" as const, content };
  });
}
```

`as const`的作用是不让role被推断成宽泛的string，而是固定成字面量。这样传给模型SDK时，类型才能严格匹配消息协议。

---

## 四、类型谓词：filter之后类型不丢失

从API拿到的大盘指数数据，有些是undefined：

```typescript
const primaryIndices = ["上证指数", "深证成指", "创业板指"]
  .map((name) => validIndices.find((item) => item.name === name))
  .filter((item): item is NonNullable<typeof item> => !!item);
```

这里`filter`里的`: item is NonNullable<typeof item>`就是类型谓词。它告诉TypeScript：经过这个filter后，item从`MarketIndex | undefined`收窄成确定存在的`MarketIndex`。

没有类型谓词的话，即使filter了`!!item`，TS仍然认为结果数组里可能有undefined。

---

## 五、Record映射类型：K线周期枚举转字符串

项目内部用`KLinePeriod`联合类型表示周期：

```typescript
export type KLinePeriod = "daily" | "weekly" | "monthly";
```

但腾讯K线API需要"day"/"week"/"month"。用`Record`建立映射：

```typescript
const TENCENT_KLINE_PERIOD: Record<KLinePeriod, string> = {
  daily: "day",
  weekly: "week",
  monthly: "month",
};
```

`Record<KLinePeriod, string>`的含义是：KLinePeriod联合类型里的每个成员，都必须在这里有对应值。少一个key或写错key，TS都会直接报错。

这比普通的对象字面量更安全，因为后期如果给KLinePeriod加了"hourly"，TS会强制要求你同步更新映射表。

---

## 六、ReturnType复用：避免类型漂移

聊天路由里有一个消息转换函数：

```typescript
function convertMessages(messages: IncomingMessage[]) {
  return messages.map((msg) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: extractContent(msg),
  }));
}
```

fallback函数需要接收convertMessages的返回值类型，但不希望手写一遍。用`ReturnType`复用：

```typescript
function requestFallback(messages: ReturnType<typeof convertMessages>) {
  // 直接复用convertMessages的返回值类型
}
```

这样如果convertMessages的返回结构变了，fallback函数的参数类型会自动跟着变，避免类型漂移。

---

## 七、unknown比any更安全

错误处理时，用`unknown`代替`any`：

```typescript
function buildFriendlyChatError(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error);
  // ...
}
```

`unknown`要求必须先做类型收窄（如`instanceof Error`），才能访问属性。`any`则完全绕过类型检查。

在这个项目里，AI服务可能返回各种异常：超时、JSON解析失败、503错误。用`unknown`强制处理每种情况，比`any`更安全。

---

## 八、严格模式的配置要点

项目的`tsconfig.json`开了`strict: true`，它实际上启用了以下所有选项：

- `noImplicitAny`：禁止隐式any
- `strictNullChecks`：null/undefined需要显式处理
- `strictFunctionTypes`：函数参数类型严格逆变
- `strictBindCallApply`：bind/call/apply类型检查
- `strictPropertyInitialization`：类属性必须初始化
- `noImplicitThis`：this需要显式类型
- `alwaysStrict`：严格模式执行

其中`strictNullChecks`在这个项目里最值钱。技术指标计算中经常有"数据不足"的情况：

```typescript
function calculateMA(closes: number[], period: number): number | null {
  if (closes.length < period) return null;
  // ...
}
```

返回`number | null`而不是`number`，强制调用方处理数据不足的情况。

---

## 九、路径别名与模块组织

项目用`@/*`指向`src/*`：

```typescript
import { useStockQuote } from "@/lib/hooks/useStockData";
import type { StockQuote } from "@/types/stock";
import { getPriceColor } from "@/styles/stock-colors";
```

配合`tsconfig.json`的paths配置：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

这样避免了`../../../../types/stock`这种相对路径地狱，重构时移动文件不需要改import路径。

---

## 十、经验总结

1. **泛型不是炫技，是减少重复代码**。一个`ApiResponse<T>`代替了N个具体响应接口
2. **as const比想象中常用**。任何需要字面量类型的地方都值得考虑
3. **类型谓词是filter的好朋友**。没有它，filter后的类型仍然是nullable
4. **Record让映射表可维护**。新增枚举值时，TS会强制你补全映射
5. **ReturnType避免类型漂移**。函数返回值变了，依赖方自动感知
6. **unknown是any的严格替代品**。错误处理时先用unknown，需要时再收窄
7. **strictNullChecks防止NaN传播**。技术指标计算中，null比undefined更清晰
