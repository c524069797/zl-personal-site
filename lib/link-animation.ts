// 链接点击动效工具函数
export function handleLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
  const target = e.currentTarget
  target.style.transition = 'all 0.2s'
  target.style.opacity = '0.7'
  target.style.transform = 'scale(0.98)'

  setTimeout(() => {
    target.style.opacity = '1'
    target.style.transform = 'scale(1)'
  }, 200)
}

