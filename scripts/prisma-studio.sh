#!/bin/bash

# Prisma Studio 启动脚本
# 从 .env 文件读取 DATABASE_URL

cd "$(dirname "$0")/.."

# 检查 .env 文件是否存在
if [ ! -f ".env" ]; then
  echo "❌ 错误: 未找到 .env 文件"
  echo "请先在项目根目录创建 .env 文件并配置 DATABASE_URL"
  echo ""
  echo "示例:"
  echo '  DATABASE_URL="postgresql://用户名:密码@localhost:5432/personal_site?schema=public"'
  exit 1
fi

# 从 .env 读取 DATABASE_URL
export DATABASE_URL=$(grep -E '^DATABASE_URL=' .env | cut -d'=' -f2- | tr -d '"' | tr -d "'")

if [ -z "$DATABASE_URL" ]; then
  echo "❌ 错误: .env 文件中未找到 DATABASE_URL"
  echo "请确保 .env 文件包含 DATABASE_URL 配置"
  exit 1
fi

# 隐藏密码显示
DB_URL_PREVIEW=$(echo "$DATABASE_URL" | sed -E 's/:\/\/[^:]+:[^@]+@/:\/\/***:***@/')

echo "🚀 启动 Prisma Studio..."
echo "📊 数据库: $DB_URL_PREVIEW"
echo "🌐 访问地址: http://localhost:5555"
echo ""
echo "按 Ctrl+C 停止"
echo ""

npx prisma studio
