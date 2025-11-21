# 执行 Vercel 数据库迁移指南

## 方法一：等待代码部署后使用 API（推荐）

代码已推送到 GitHub，Vercel 会自动部署。部署完成后（通常需要 2-5 分钟），在浏览器中访问：

```
https://www.clczl.asia/api/admin/migrate-category-field
```

或者使用 curl：

```bash
curl https://www.clczl.asia/api/admin/migrate-category-field
```

## 方法二：使用 Vercel CLI 直接执行

如果 API 路由暂时不可用，可以使用 Vercel CLI：

```bash
# 1. 安装 Vercel CLI（如果还没有）
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 链接项目
vercel link

# 4. 拉取环境变量（包含 DATABASE_URL）
vercel env pull .env.local

# 5. 运行迁移脚本
npx tsx scripts/add-category-field.ts
```

## 方法三：在 Vercel Dashboard 中执行

1. 登录 Vercel Dashboard：https://vercel.com/dashboard
2. 选择你的项目
3. 进入 "Settings" -> "Environment Variables"
4. 确认 `DATABASE_URL` 已设置
5. 进入 "Functions" 标签页
6. 找到 `/api/admin/migrate-category-field` 函数
7. 点击 "Invoke" 按钮执行

## 验证迁移结果

迁移成功后，API 会返回：

```json
{
  "success": true,
  "message": "成功添加category字段！共更新 X 篇文章",
  "updatedCount": X
}
```

然后可以访问以下 URL 验证：

- 技术博客：https://www.clczl.asia/blog?category=tech
- 生活记录：https://www.clczl.asia/blog?category=life

## 注意事项

- 迁移脚本使用 `IF NOT EXISTS`，可以安全地多次执行
- 如果字段已存在，不会重复添加
- 迁移会自动更新所有现有文章的分类

