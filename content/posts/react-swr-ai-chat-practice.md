---
title: "React实战：从SWR到流式AI聊天的组件设计思路"
summary: "以一个AI投资助手项目为例，分享Next.js App Router下的React组件设计实践，包括SWR数据层封装、流式AI聊天架构、以及Server/Client Component的边界划分。"
date: "2026-02-20"
tags: ["React", "Next.js", "SWR", "AI", "前端架构"]
category: "tech"
---

## 一、项目背景与架构选型

最近在做一个面向中老年用户的AI投资助手，技术栈选了Next.js 16 + React 19 + TypeScript。这个项目的特殊性在于：既要展示实时股票行情（高频刷新），又要支持AI流式对话（长连接），还要适配移动端和桌面端双端布局。

这几个需求放在一起，对组件设计和数据管理提出了比较高的要求。

---

## 二、SWR数据层：一个fetcher服务所有hook

行情数据需要15-60秒自动刷新，但不同接口的刷新频率不一样。用SWR很合适，关键是把fetcher做成泛型：

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  const json: ApiResponse<T> = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.error ?? "Failed to fetch");
  }
  return json.data;
};
```

这个fetcher用了泛型`<T>`，谁调用谁决定返回类型。上层hook可以专注于key和刷新策略：

```typescript
export function useStockQuote(market: number, code: string) {
  return useSWR<StockQuote>(
    code ? `/api/stocks?action=quote&market=${market}&code=${code}` : null,
    fetcher,
    { refreshInterval: 30000 },
  );
}

export function useMarketIndices() {
  return useSWR<MarketIndex[]>("/api/stocks?action=indices", fetcher, {
    refreshInterval: 15000,
  });
}
```

**关键设计**：
- `key`为`null`时SWR不发送请求，这是很常见的条件请求模式
- 大盘指数15秒刷新，个股行情30秒刷新，K线60秒刷新，各自独立配置
- 搜索接口用`dedupingInterval: 1000`防抖，避免用户输入时频繁请求

---

## 三、流式AI聊天：useChat + TextStreamChatTransport

聊天模块是项目的核心，技术组合：
- `@ai-sdk/react/useChat`：管理消息流、提交状态、错误态
- `TextStreamChatTransport`：把前端输入接到后端Route Handler
- Next.js App Router：通过searchParams支持"从股票页一键带问题进入聊天"

**传输层配置**：

```typescript
const transport = useMemo(
  () => new TextStreamChatTransport({ 
    api: "/api/chat", 
    body: { sessionId } 
  }),
  [sessionId],
);

const { messages, sendMessage, status } = useChat({
  transport,
  messages: initialMessages,
  onFinish: () => {
    setChatError("");
    onConversationChange();
  },
  onError: (error) => {
    setChatError(error instanceof Error ? error.message : "AI助手暂时无法响应");
  },
});
```

**跨页面联动**：股票卡片上的"AI分析"按钮，通过`searchParams`把股票代码和预设prompt带到聊天页：

```typescript
// 股票页点击"AI分析"
router.push(`/chat?stock=${code}&name=${name}`);

// 聊天页接收并自动发送
useEffect(() => {
  const stock = searchParams.get("stock");
  const stockName = searchParams.get("name");
  if (stock && !autoPromptSentRef.current) {
    autoPromptSentRef.current = true;
    sendMessage({ text: buildStockPrompt(stock, stockName) });
  }
}, [searchParams, sendMessage]);
```

这种设计让用户在任何页面都能一键触发AI分析，不用手动复制粘贴问题。

---

## 四、Server/Client Component的边界划分

Next.js App Router下，"use client"不是越少越好，而是要把边界划清楚。

**Server Component**（默认）：
- 页面初始数据获取
- 不依赖浏览器API的静态内容
- SEO敏感的首屏内容

**Client Component**（"use client"）：
- 用了useState/useEffect/useRef
- 事件处理、DOM操作
- 浏览器API（localStorage、WebSocket等）

这个项目的实践：
- 行情卡片`StockCard`是Client Component，因为有点击事件和路由跳转
- 聊天窗口`ChatWindow`是Client Component，因为用了useChat和大量状态管理
- API路由是服务端代码，天然Server-side

**一个容易踩的坑**：`useSearchParams`只能在Client Component用，因为它依赖浏览器URL。如果页面同时需要SEO和URL参数，就把URL参数处理放到Client Component子树里。

---

## 五、响应式布局：一套代码适配双端

项目用Ant Design的`useBreakpoint`判断设备类型：

```typescript
const screens = useBreakpoint();
const isMobile = !screens.md;
```

桌面端左侧显示会话历史面板，移动端把历史收到Drawer里：

```tsx
{!isMobile && (
  <Card className="chat-sidebar-card">
    <SessionList ... />
  </Card>
)}

{isMobile && (
  <Drawer title="历史对话" placement="left" open={historyOpen} ...>
    <SessionList ... />
  </Drawer>
)}
```

同一个`SessionList`组件，桌面端直接渲染，移动端塞进Drawer。组件本身不感知自己在哪，由父组件决定容器。

---

## 六、组件拆分：大组件拆成纯展示+逻辑容器

`ChatWindow`原本可以写成600行的单文件，但拆成了三层：

1. **ChatWindow**（容器）：管理会话列表、选中状态、用户认证
2. **SessionList**（展示）：纯展示会话列表，支持搜索、重命名、删除
3. **ConversationPanel**（展示）：管理消息输入、流式渲染、快捷问题

容器负责数据，展示组件负责UI。这样测试时可以单独测展示组件，不用mock整个聊天链路。

---

## 七、经验总结

1. **SWR的key设计决定缓存粒度**：把市场代码和股票代码都编进key，避免不同股票的缓存互相污染
2. **useMemo缓存transport对象**：避免每次渲染都新建TextStreamChatTransport导致连接断开
3. **ref处理自动发送的竞态**：用`autoPromptSentRef`防止useEffect重复发送同一条prompt
4. **错误边界要分层**：API错误、AI错误、网络错误，各自给不同的用户提示
5. **CSS变量做主题适配**：`--chat-font-scale`控制聊天字体缩放，方便中老年用户调节
