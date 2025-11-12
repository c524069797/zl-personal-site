#!/bin/bash

# Prisma Studio 启动脚本
# 自动设置 DATABASE_URL 环境变量

cd "$(dirname "$0")/.."

export DATABASE_URL="postgresql://chenzilong@localhost:5432/personal_site?schema=public"

echo "🚀 启动 Prisma Studio..."
echo "📊 数据库: personal_site"
echo "🌐 访问地址: http://localhost:5555"
echo ""
echo "按 Ctrl+C 停止"
echo ""

npx prisma studio

