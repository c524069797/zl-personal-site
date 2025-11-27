# 用户认证和文章管理功能说明

## ✅ 已完成的功能

### 1. 用户认证系统

**API 端点：**
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息

**页面：**
- `/login` - 登录页面
- `/register` - 注册页面
- `/profile` - 个人中心页面

### 2. 文章管理 API（CRUD）

**API 端点：**
- `GET /api/admin/posts` - 获取所有文章（需认证）
- `POST /api/admin/posts` - 创建文章（需认证）
- `GET /api/admin/posts/[id]` - 获取单篇文章（需认证）
- `PUT /api/admin/posts/[id]` - 更新文章（需认证）
- `DELETE /api/admin/posts/[id]` - 删除文章（需认证）

### 3. 功能特性

- ✅ 用户注册和登录
- ✅ JWT Token 认证
- ✅ 密码加密（bcrypt）
- ✅ 个人中心查看个人信息
- ✅ 查看自己的文章列表
- ✅ 删除自己的文章
- ✅ 权限控制（只能编辑/删除自己的文章，管理员可以管理所有文章）

---

## 🚀 使用方法

### 1. 注册账号

1. 访问 `/register`
2. 填写邮箱、密码等信息
3. 点击注册
4. 自动跳转到个人中心

### 2. 登录

1. 访问 `/login`
2. 输入邮箱和密码
3. 点击登录
4. 自动跳转到个人中心

### 3. 个人中心

访问 `/profile` 可以：
- 查看个人信息
- 查看自己的文章列表
- 删除文章
- 退出登录

---

## 🔐 认证机制

### Token 存储

登录成功后，Token 会保存在 `localStorage` 中：
- `token` - JWT Token
- `user` - 用户信息（JSON 字符串）

### API 请求

所有需要认证的 API 请求需要在 Header 中添加：

```
Authorization: Bearer <token>
```

### Token 过期

Token 默认有效期为 7 天。过期后需要重新登录。

---

## 📝 环境变量

需要在 `.env` 文件中添加：

```env
JWT_SECRET=your-secret-key-change-in-production
```

**重要：** 在生产环境中，请使用强随机字符串作为 JWT_SECRET！

---

## 🎯 下一步功能（待实现）

- [ ] 文章创建/编辑页面
- [ ] 文章发布/草稿功能
- [ ] 用户信息编辑
- [ ] 密码修改
- [ ] 管理员后台
- [ ] 文章搜索和筛选

---

## 📚 API 使用示例

### 注册

```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: '用户名',
  }),
})

const data = await response.json()
// { user: {...}, token: '...', message: '注册成功' }
```

### 登录

```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
  }),
})

const data = await response.json()
// { user: {...}, token: '...', message: '登录成功' }
```

### 创建文章

```javascript
const token = localStorage.getItem('token')

const response = await fetch('/api/admin/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: '文章标题',
    content: '文章内容...',
    summary: '文章摘要',
    tags: ['标签1', '标签2'],
    published: true,
  }),
})
```

### 更新文章

```javascript
const token = localStorage.getItem('token')

const response = await fetch(`/api/admin/posts/${postId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: '新标题',
    content: '新内容...',
    tags: ['新标签'],
    published: true,
  }),
})
```

### 删除文章

```javascript
const token = localStorage.getItem('token')

const response = await fetch(`/api/admin/posts/${postId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})
```

---

## 🐛 故障排除

### Token 无效

如果遇到 "未授权" 错误：
1. 检查 Token 是否过期
2. 重新登录获取新 Token
3. 检查 JWT_SECRET 是否正确配置

### 无法创建文章

1. 确保已登录
2. 检查 Token 是否正确传递
3. 检查文章标题和内容是否填写

---

## 📖 相关文件

- `lib/auth.ts` - 认证工具函数
- `lib/middleware.ts` - 认证中间件
- `app/api/auth/` - 认证 API
- `app/api/admin/posts/` - 文章管理 API
- `app/login/page.tsx` - 登录页面
- `app/register/page.tsx` - 注册页面
- `app/profile/page.tsx` - 个人中心页面

