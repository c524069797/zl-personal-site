#!/bin/bash

# Vercel 数据库迁移脚本 - Category 字段
# 使用方法：在 Vercel 环境变量中设置 DATABASE_URL，然后运行此脚本

echo "开始迁移 category 字段..."

# 检查 DATABASE_URL 是否设置
if [ -z "$DATABASE_URL" ]; then
  echo "错误: DATABASE_URL 环境变量未设置"
  echo "请先设置 DATABASE_URL 环境变量"
  exit 1
fi

# 运行迁移脚本
npx tsx scripts/add-category-field.ts

echo "迁移完成！"

