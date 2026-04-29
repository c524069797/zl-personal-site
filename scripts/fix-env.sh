#!/bin/bash

# 创建 .env 文件模板
# 所有敏感值留空，由用户自行填写

cd "$(dirname "$0")/.."

ENV_FILE=".env"
BACKUP_FILE=".env.backup.$(date +%Y%m%d_%H%M%S)"

# 备份原文件
if [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" "$BACKUP_FILE"
    echo "✅ 已备份原文件为: $BACKUP_FILE"
fi

# 创建 .env 模板
cat > "$ENV_FILE" << 'EOF'
# Environment variables for personal-site
# 请将所有 <...> 占位符替换为实际值

# Database connection
DATABASE_URL=""

# JWT secret for authentication (至少32位随机字符串)
JWT_SECRET=""

# Password encryption secret
PASSWORD_SECRET=""

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
EOF

echo "✅ .env 文件已创建！"
echo ""
echo "⚠️  请先编辑 .env 文件，填写以下必填项："
echo "   - DATABASE_URL"
echo "   - JWT_SECRET"
echo "   - PASSWORD_SECRET"
echo ""
echo "文件位置: $(pwd)/$ENV_FILE"
