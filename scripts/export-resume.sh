#!/bin/bash
# 一键导出简历：三份 Markdown + 三份 PDF，全部落到桌面。
#
# 数据源是 app/resume/data —— 网站、PDF、Markdown 同源，改一处全部同步。
# 需要临时起一个 dev 服务器来渲染 PDF，跑完自动关掉。

set -uo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$HOME/Desktop/简历导出-$(date +%Y%m%d)"
PORT=3717
STARTED_DEV=0

cd "$REPO" || { echo "❌ 找不到项目目录：$REPO"; exit 1; }
mkdir -p "$OUT"

echo "📄 导出 Markdown..."
npx tsx scripts/export-resume-md.ts "$OUT" || { echo "❌ Markdown 导出失败"; exit 1; }

# PDF 需要服务器渲染；已有实例就复用，否则临时起一个
if curl -s -o /dev/null --max-time 2 "http://localhost:3000/resume"; then
  BASE="http://localhost:3000"
  echo "🔌 复用已运行的 dev 服务器（3000）"
else
  echo "🚀 启动临时服务器（端口 ${PORT}）..."
  npx next dev -p "$PORT" > /tmp/resume-export-dev.log 2>&1 &
  DEV_PID=$!
  STARTED_DEV=1
  BASE="http://localhost:$PORT"
  for _ in $(seq 1 40); do
    curl -s -o /dev/null --max-time 2 "$BASE/resume" && break
    sleep 1
  done
fi

cleanup() {
  if [ "$STARTED_DEV" -eq 1 ] && [ -n "${DEV_PID:-}" ]; then
    kill "$DEV_PID" 2>/dev/null
    wait "$DEV_PID" 2>/dev/null
    echo "🧹 临时服务器已关闭"
  fi
}
trap cleanup EXIT

if ! curl -s -o /dev/null --max-time 3 "$BASE/resume"; then
  echo "❌ 服务器没起来，PDF 跳过。日志：/tmp/resume-export-dev.log"
  echo "📁 Markdown 已导出到：$OUT"
  exit 1
fi

echo "🖨  生成 PDF..."
# 每份 PDF 都会拉起一个 Puppeteer 实例，连续启动偶发失败，失败重试一次
generate() {
  local version="$1" name="$2" attempt
  for attempt in 1 2; do
    if curl -s --max-time 180 "$BASE/api/resume/pdf?template=tech&version=$version" -o "$OUT/$name" \
       && head -c 4 "$OUT/$name" | grep -q "%PDF"; then
      echo "✅ $name"
      sleep 2
      return 0
    fi
    [ "$attempt" -eq 1 ] && { echo "⚠️  $name 第 1 次失败，重试..."; sleep 3; }
  done
  rm -f "$OUT/$name"
  echo "❌ $name 生成失败"
  return 1
}

generate fullstack "陈子龙-AI全栈工程师-简历.pdf"
generate frontend  "陈子龙-前端工程师AI方向-简历.pdf"
generate backend   "陈子龙-AI-Agent后端工程师-简历.pdf"

echo ""
echo "🎉 全部完成，输出目录：$OUT"
ls -1 "$OUT"
open "$OUT" 2>/dev/null || true
