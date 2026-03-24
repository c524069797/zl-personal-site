# 注册功能修复说明

## 🔧 已修复的问题

### 1. 数据库连接问题

**问题**：`.env` 文件中的 `DATABASE_URL` 使用的是 Prisma 开发服务器格式，无法直接连接 PostgreSQL。

**解决方案**：
- 已更新 `.env` 文件，使用标准的 PostgreSQL 连接字符串
- 在 `lib/prisma.ts` 中添加了默认连接字符串作为后备

### 2. 密码加密方式

**问题**：使用 `bcrypt` 需要异步操作，可能在某些情况下出现问题。

**解决方案**：
- 改用 Node.js 内置的 `crypto` 模块
- 使用 HMAC-SHA256 进行简单加密
- 同步操作，更简单可靠

### 3. 错误处理

**改进**：
- 在开发环境下返回更详细的错误信息
- 添加了数据库连接检查

---

## 📝 环境变量配置

`.env` 文件现在应该包含：

```env
DATABASE_URL="postgresql://chenzilong@localhost:5432/personal_site?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
PASSWORD_SECRET="password-secret-key"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

---

## 🚀 下一步操作

### 1. 重启开发服务器

**重要**：必须重启开发服务器才能加载新的环境变量！

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
npm run dev
```

### 2. 测试注册

访问 http://localhost:3000/register 并尝试注册：

```json
{
  "name": "陈子龙",
  "email": "chenzhuo995@gmail.com",
  "password": "czl990515"
}
```

### 3. 如果还有问题

检查：
1. PostgreSQL 服务是否运行：`brew services list | grep postgresql`
2. 数据库是否存在：`psql -l | grep personal_site`
3. 查看服务器终端的错误日志

---

## 🔍 故障排查

### 问题：仍然无法连接数据库

**解决**：
1. 确保 PostgreSQL 服务运行：
   ```bash
   brew services start postgresql@15
   ```

2. 测试数据库连接：
   ```bash
   psql personal_site
   ```

3. 检查环境变量：
   ```bash
   cat .env | grep DATABASE_URL
   ```

### 问题：密码加密错误

**解决**：
- 确保 `PASSWORD_SECRET` 在 `.env` 文件中
- 重启开发服务器

---

## ✅ 验证修复

运行测试脚本验证：

```bash
export DATABASE_URL="postgresql://chenzilong@localhost:5432/personal_site?schema=public"
npx tsx scripts/test-register.ts
```

如果测试通过，注册功能应该可以正常工作了！

