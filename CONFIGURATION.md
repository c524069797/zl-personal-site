# 配置文档

## 概述

本项目包含多种配置文件，包括 Next.js 配置、Tailwind CSS 配置、TypeScript 配置、ESLint 配置等。本文档详细说明了所有配置项及其用途。

## 环境变量配置

### 必需的环境变量

#### 数据库配置
```env
# PostgreSQL 数据库连接字符串
DATABASE_URL="postgresql://username:password@localhost:5432/personal_site?schema=public"
```

**配置说明**:
- **格式**: `postgresql://[user]:[password]@[host]:[port]/[database]?schema=[schema]`
- **默认值**: 无，必须配置
- **用途**: Prisma 连接数据库使用

#### JWT 认证配置
```env
# JWT 密钥，用于生成和验证身份令牌
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

**配置说明**:
- **要求**: 生产环境必须使用强密钥
- **长度**: 建议至少 32 个字符
- **用途**: 用户认证和会话管理

#### 站点 URL 配置
```env
# 网站基础 URL，用于生成绝对链接
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

**配置说明**:
- **开发环境**: `http://localhost:3000`
- **生产环境**: `https://yourdomain.com`
- **用途**: SEO、RSS feed、社交分享等

### AI 服务配置

#### OpenAI API 配置
```env
# OpenAI API 密钥
OPENAI_API_KEY="sk-..."

# OpenAI API 基础 URL（可选，用于代理）
OPENAI_API_BASE_URL="https://api.openai.com/v1"

# OpenAI 模型配置（可选）
OPENAI_MODEL="gpt-4"
OPENAI_EMBEDDING_MODEL="text-embedding-ada-002"
```

#### DeepSeek API 配置
```env
# DeepSeek API 密钥
DEEPSEEK_API_KEY="sk-..."

# DeepSeek API 基础 URL
DEEPSEEK_API_BASE_URL="https://api.deepseek.com/v1"

# DeepSeek 模型配置
DEEPSEEK_MODEL="deepseek-chat"
```

### 向量数据库配置

#### Qdrant 配置
```env
# Qdrant 服务地址
QDRANT_URL="http://localhost:6333"

# Qdrant API 密钥（如果启用认证）
QDRANT_API_KEY="your-qdrant-api-key"
```

### 可选的环境变量

#### 密码加密配置
```env
# 密码哈希密钥（bcrypt rounds）
BCRYPT_ROUNDS="12"
```

#### 日志配置
```env
# 日志级别: error, warn, info, debug
LOG_LEVEL="info"

# 是否启用查询日志
PRISMA_LOG_QUERIES="false"
```

#### 性能配置
```env
# API 超时时间（秒）
API_TIMEOUT="60"

# 数据库连接池大小
DATABASE_POOL_SIZE="10"
```

## Next.js 配置

### 基础配置 (`next.config.ts`)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 启用 React 严格模式
  reactStrictMode: true,

  // 图片优化配置
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ['your-cdn-domain.com'],
  },

  // 实验性功能
  experimental: {
    // Server Actions 配置
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_VALUE,
  },

  // 重定向配置
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },

  // 重写配置
  async rewrites() {
    return [
      {
        source: '/api/external/:path*',
        destination: 'https://external-api.com/:path*',
      },
    ];
  },

  // 头部配置
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type,Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### 配置说明

#### React 严格模式
```typescript
reactStrictMode: true
```
- **用途**: 帮助发现潜在的 React 问题
- **影响**: 开发环境会双重渲染组件

#### 图片优化
```typescript
images: {
  formats: ["image/avif", "image/webp"],
  domains: ['your-cdn-domain.com'],
}
```
- **支持格式**: AVIF、WebP、PNG、JPG
- **域名限制**: 防止恶意图片加载
- **自动优化**: 压缩和格式转换

#### Server Actions
```typescript
experimental: {
  serverActions: {
    bodySizeLimit: '2mb',
  },
}
```
- **用途**: Next.js 13+ 的服务器操作
- **限制**: 请求体大小限制

## Tailwind CSS 配置

### 基础配置 (`tailwind.config.ts`)

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  // 暗色模式支持
  darkMode: "class",

  // 内容路径
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // 主题扩展
  theme: {
    extend: {
      // 自定义颜色
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },

      // 自定义字体
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },

      // 自定义间距
      spacing: {
        '18': '4.5rem',
      },

      // 自定义断点
      screens: {
        'xs': '475px',
      },
    },
  },

  // 插件配置
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};

export default config;
```

### 配置说明

#### 暗色模式
```typescript
darkMode: "class"
```
- **策略**: 通过 CSS 类切换暗色模式
- **实现**: `next-themes` 库支持

#### 内容路径
```typescript
content: [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
]
```
- **用途**: 指定需要扫描的样式文件
- **优化**: 只包含必要的文件路径

#### 主题扩展
- **颜色**: 自定义颜色变量
- **字体**: 自定义字体栈
- **间距**: 自定义间距值
- **断点**: 响应式断点

## TypeScript 配置

### 基础配置 (`tsconfig.json`)

```json
{
  "compilerOptions": {
    // 目标 ES 版本
    "target": "ES2022",

    // 库支持
    "lib": ["dom", "dom.iterable", "es6"],

    // 允许 JS 文件
    "allowJs": true,

    // 跳过库检查
    "skipLibCheck": true,

    // 严格模式
    "strict": true,

    // 模块解析
    "moduleResolution": "bundler",
    "resolveJsonModule": true,

    // 模块系统
    "module": "ESNext",

    // JSX 支持
    "jsx": "preserve",

    // 增量编译
    "incremental": true,

    // 插件
    "plugins": [
      {
        "name": "next"
      }
    ],

    // 路径映射
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },

    // 输出配置
    "declaration": false,
    "outDir": "dist",

    // 其他配置
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true
  },

  // 包含文件
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],

  // 排除文件
  "exclude": [
    "node_modules"
  ]
}
```

### 配置说明

#### 编译目标
```json
"target": "ES2022"
```
- **支持**: 现代 JavaScript 特性
- **兼容性**: 需要构建工具转换

#### 严格模式
```json
"strict": true
```
- **类型检查**: 强制类型检查
- **空值检查**: 防止 null/undefined 错误

#### 路径映射
```json
"paths": {
  "@/*": ["./*"]
}
```
- **简化导入**: `@/components/Button` 而不是 `../../../components/Button`
- **IDE 支持**: 更好的代码提示

## ESLint 配置

### 基础配置 (`eslint.config.mjs`)

```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js 推荐配置
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 自定义规则
  {
    rules: {
      // 自定义规则
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/exhaustive-deps": "warn",

      // 关闭某些规则
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
    },
  },

  // 忽略文件
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "*.config.js",
    ],
  },
];

export default eslintConfig;
```

### 配置说明

#### 规则配置
- **TypeScript**: 类型检查规则
- **React**: React 相关规则
- **Next.js**: Next.js 最佳实践

#### 自定义规则
```javascript
rules: {
  "@typescript-eslint/no-unused-vars": "error",     // 未使用变量错误
  "@typescript-eslint/no-explicit-any": "warn",     // any 类型警告
  "react-hooks/exhaustive-deps": "warn",           // Hook 依赖警告
}
```

## Prisma 配置

### 数据库配置 (`prisma/schema.prisma`)

```prisma
// 数据源配置
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 生成器配置
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}
```

### 配置说明

#### 数据源
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
- **提供商**: PostgreSQL、MySQL、SQLite 等
- **连接**: 从环境变量读取

#### 生成器
```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}
```
- **客户端生成**: TypeScript 类型定义
- **预览功能**: 实验性功能

## 构建和部署配置

### Vercel 配置 (`vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["sin1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Docker 配置 (`Dockerfile`)

```dockerfile
# 基础镜像
FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# 生产镜像
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

## 开发工具配置

### Prettier 配置 (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Husky 配置 (`.husky/pre-commit`)

```bash
#!/bin/bash
npx lint-staged
```

### lint-staged 配置 (`package.json`)

```json
"lint-staged": {
  "*.{ts,tsx,js,jsx}": [
    "eslint --fix --max-warnings=0"
  ],
  "*.{ts,tsx,js,jsx,json,css,md}": [
    "prettier --write"
  ]
}
```

## 环境特定配置

### 开发环境 (`.env.local`)

```env
# 开发环境配置
NODE_ENV=development
DATABASE_URL="postgresql://localhost:5432/personal_site_dev"
DEBUG=true
LOG_LEVEL=debug

# 开发工具
NEXT_TELEMETRY_DISABLED=1
```

### 测试环境 (`.env.test`)

```env
# 测试环境配置
NODE_ENV=test
DATABASE_URL="postgresql://localhost:5432/personal_site_test"
JWT_SECRET="test-secret-key"

# 禁用外部 API
OPENAI_API_KEY="test-key"
```

### 生产环境 (`.env.production`)

```env
# 生产环境配置
NODE_ENV=production
DATABASE_URL="postgresql://prod-db-host:5432/personal_site"
JWT_SECRET="production-secret-key"

# 生产优化
NEXT_TELEMETRY_DISABLED=1
LOG_LEVEL=warn
```

## 配置验证

### 环境变量验证脚本

```bash
#!/bin/bash

# 必需的环境变量检查
required_vars=("DATABASE_URL" "JWT_SECRET" "NEXT_PUBLIC_SITE_URL")

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ 缺少必需的环境变量: $var"
    exit 1
  fi
done

echo "✅ 环境变量验证通过"
```

### 配置热重载

```typescript
// 开发环境配置热重载
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '.env.local' });
}
```

## 安全配置

### CORS 配置

```typescript
// next.config.ts
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: process.env.NODE_ENV === 'production'
            ? 'https://yourdomain.com'
            : '*'
        },
        {
          key: 'Access-Control-Allow-Methods',
          value: 'GET,POST,PUT,DELETE,OPTIONS',
        },
        {
          key: 'Access-Control-Allow-Headers',
          value: 'Content-Type,Authorization',
        },
      ],
    },
  ];
}
```

### 安全头部

```typescript
// next.config.ts
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
  ];
}
```

## 性能配置

### 缓存配置

```typescript
// next.config.ts
export default {
  // 静态优化
  poweredByHeader: false,

  // 压缩
  compress: true,

  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1年
  },

  // 实验性功能
  experimental: {
    // 优化包大小
    optimizePackageImports: ['antd', '@ant-design/icons'],
  },
};
```

### Bundle 分析

```typescript
// next.config.ts (仅开发环境)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Next.js 配置
});
```

## 监控和日志

### 日志配置

```typescript
// lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});
```

### 错误跟踪

```typescript
// lib/error-tracking.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

## 配置管理最佳实践

### 1. 环境分离
- **开发**: 本地开发环境
- **测试**: 自动化测试环境
- **生产**: 线上生产环境

### 2. 密钥管理
- **不要提交**: 敏感信息不要提交到版本控制
- **环境变量**: 使用环境变量管理敏感配置
- **密钥轮换**: 定期更换生产环境密钥

### 3. 配置验证
- **启动检查**: 应用启动时验证必需配置
- **类型安全**: 使用 TypeScript 定义配置类型
- **文档同步**: 保持配置文档与代码同步

### 4. 版本控制
- **配置版本**: 记录配置变更历史
- **回滚策略**: 支持配置快速回滚
- **变更通知**: 重要配置变更通知相关人员

### 5. 监控告警
- **配置监控**: 监控配置变更和异常
- **性能监控**: 监控配置对性能的影响
- **安全监控**: 监控敏感配置的访问




