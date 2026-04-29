#!/bin/bash

# 更新 .env 文件中的环境变量
# 不硬编码任何值，确保敏感信息不会泄露到代码仓库

cd "$(dirname "$0")/.."

ENV_FILE=".env"

# 备份原文件
if [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" "$ENV_FILE.backup"
    echo "✅ 已备份原 .env 文件为 .env.backup"
fi

# 检查文件是否存在
if [ ! -f "$ENV_FILE" ]; then
    echo "创建新的 .env 文件..."
    touch "$ENV_FILE"
fi

# 确保 DATABASE_URL 存在（如果不存在则添加空值）
if ! grep -q "^DATABASE_URL=" "$ENV_FILE"; then
    echo 'DATABASE_URL=""' >> "$ENV_FILE"
    echo "⚠️  已添加 DATABASE_URL（请手动填写值）"
fi

# 确保 JWT_SECRET 存在
if ! grep -q "^JWT_SECRET=" "$ENV_FILE"; then
    echo 'JWT_SECRET=""' >> "$ENV_FILE"
    echo "⚠️  已添加 JWT_SECRET（请手动填写值）"
fi

# 确保 PASSWORD_SECRET 存在
if ! grep -q "^PASSWORD_SECRET=" "$ENV_FILE"; then
    echo 'PASSWORD_SECRET=""' >> "$ENV_FILE"
    echo "⚠️  已添加 PASSWORD_SECRET（请手动填写值）"
fi

# 确保 NEXT_PUBLIC_SITE_URL 存在
if ! grep -q "^NEXT_PUBLIC_SITE_URL=" "$ENV_FILE"; then
    echo 'NEXT_PUBLIC_SITE_URL="http://localhost:3000"' >> "$ENV_FILE"
    echo "✅ 已添加 NEXT_PUBLIC_SITE_URL"
fi

echo ""
echo "✅ .env 文件已更新完成！"
echo ""
echo "⚠️  请检查并填写所有空值的环境变量。"
