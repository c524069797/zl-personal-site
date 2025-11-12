#!/bin/bash

# 更新 .env 文件中的 DATABASE_URL

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

# 更新或添加 DATABASE_URL
if grep -q "^DATABASE_URL=" "$ENV_FILE"; then
    # 如果存在，替换它
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' 's|^DATABASE_URL=.*|DATABASE_URL="postgresql://chenzilong@localhost:5432/personal_site?schema=public"|' "$ENV_FILE"
    else
        # Linux
        sed -i 's|^DATABASE_URL=.*|DATABASE_URL="postgresql://chenzilong@localhost:5432/personal_site?schema=public"|' "$ENV_FILE"
    fi
    echo "✅ 已更新 DATABASE_URL"
else
    # 如果不存在，添加它
    echo 'DATABASE_URL="postgresql://chenzilong@localhost:5432/personal_site?schema=public"' >> "$ENV_FILE"
    echo "✅ 已添加 DATABASE_URL"
fi

# 确保 JWT_SECRET 存在
if ! grep -q "^JWT_SECRET=" "$ENV_FILE"; then
    echo 'JWT_SECRET="your-secret-key-change-in-production"' >> "$ENV_FILE"
    echo "✅ 已添加 JWT_SECRET"
fi

# 确保 PASSWORD_SECRET 存在
if ! grep -q "^PASSWORD_SECRET=" "$ENV_FILE"; then
    echo 'PASSWORD_SECRET="password-secret-key"' >> "$ENV_FILE"
    echo "✅ 已添加 PASSWORD_SECRET"
fi

# 确保 NEXT_PUBLIC_SITE_URL 存在
if ! grep -q "^NEXT_PUBLIC_SITE_URL=" "$ENV_FILE"; then
    echo 'NEXT_PUBLIC_SITE_URL="http://localhost:3000"' >> "$ENV_FILE"
    echo "✅ 已添加 NEXT_PUBLIC_SITE_URL"
fi

echo ""
echo "✅ .env 文件已更新完成！"
echo ""
echo "当前配置："
grep -E "^(DATABASE_URL|JWT_SECRET|PASSWORD_SECRET|NEXT_PUBLIC_SITE_URL)=" "$ENV_FILE" | sed 's/=.*/=***/'

