export default function BlogLoading() {
  return (
    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--foreground)' }}>
      {/* 
        【React 进阶模式学习：利用 Next.js 约定的 loading.tsx】
        使用此文件后，Next.js 会自动在 page.tsx 外层包裹一个 <Suspense>，
        并把当前组件作为 fallback。
        这样既避免了在 page 中硬编码，又保证了全局导航和页脚在加载时依然可见。
      */}
      加载中...
    </div>
  );
}
