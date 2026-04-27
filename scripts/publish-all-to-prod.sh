#!/bin/bash
# 批量发布所有文章到线上数据库

set -e

DB_URL="postgres://811dcd5dabee7ad65d0ace45ab056cf313151fd6c8259626f0b1b359e7cfd665:sk_Agp49op08-QvPsj5vMZxS@db.prisma.io:5432/postgres?sslmode=require"
POSTS_DIR="content/posts"

# 获取所有 .md 文件
files=($POSTS_DIR/*.md)
total=${#files[@]}
echo "共找到 $total 篇文章，开始发布到线上数据库..."

# 每批并行5个
batch_size=5
for ((i=0; i<total; i+=batch_size)); do
  echo ""
  echo "=== 发布第 $((i+1)) - $((i+batch_size > total ? total : i+batch_size)) / $total 篇 ==="
  
  for ((j=i; j<i+batch_size && j<total; j++)); do
    file="${files[$j]}"
    echo "  发布: $(basename $file)"
    DATABASE_URL="$DB_URL" npx tsx scripts/auto-publish-post.ts "$file" --auto-publish > /tmp/publish_$(basename $file .md).log 2>&1 &
  done
  
  wait
  
  # 检查每个结果
  for ((j=i; j<i+batch_size && j<total; j++)); do
    file="${files[$j]}"
    logfile="/tmp/publish_$(basename $file .md).log"
    if grep -q "✅ 已创建" "$logfile" 2>/dev/null || grep -q "✅ 已更新" "$logfile" 2>/dev/null; then
      echo "  ✅ $(basename $file)"
    elif grep -q "⏭️  跳过" "$logfile" 2>/dev/null; then
      echo "  ⏭️  $(basename $file) (已存在)"
    else
      echo "  ❌ $(basename $file)"
      cat "$logfile" | tail -5
    fi
  done
done

echo ""
echo "=== 批量发布完成 ==="
