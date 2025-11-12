#!/bin/bash

# 修复 .env 文件格式问题

cd "$(dirname "$0")/.."

ENV_FILE=".env"
BACKUP_FILE=".env.backup.$(date +%Y%m%d_%H%M%S)"

# 备份原文件
if [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" "$BACKUP_FILE"
    echo "✅ 已备份原文件为: $BACKUP_FILE"
fi

# 创建新的 .env 文件
cat > "$ENV_FILE" << 'EOF'
# Environment variables for personal-site

# Database connection
DATABASE_URL="postgresql://chenzilong@localhost:5432/personal_site?schema=public"

# JWT secret for authentication
JWT_SECRET="your-secret-key-change-in-production"

# Password encryption secret
PASSWORD_SECRET="password-secret-key"

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
EOF

echo "✅ .env 文件已修复！"
echo ""
echo "当前配置："
echo "---"
cat "$ENV_FILE"
echo "---"

