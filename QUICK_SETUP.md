# 快速设置指南

## ✅ 已完成

- ✅ PostgreSQL 已安装（postgresql@15）
- ✅ PostgreSQL 服务正在运行
- ✅ 数据库 `personal_site` 已创建

## 🔧 将 PostgreSQL 添加到 PATH（可选，但推荐）

这样以后就可以直接使用 `psql`、`createdb` 等命令，而不需要完整路径。

### 方法一：添加到 ~/.zshrc（推荐）

```bash
# 编辑 ~/.zshrc 文件
nano ~/.zshrc

# 在文件末尾添加以下内容：
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"

# 保存并退出（Ctrl+X, 然后 Y, 然后 Enter）

# 重新加载配置
source ~/.zshrc

# 验证是否生效
which psql
which createdb
```

### 方法二：使用完整路径（临时方案）

如果不想修改 PATH，可以直接使用完整路径：

```bash
# 创建数据库
/opt/homebrew/opt/postgresql@15/bin/createdb 数据库名

# 连接数据库
/opt/homebrew/opt/postgresql@15/bin/psql 数据库名

# 列出所有数据库
/opt/homebrew/opt/postgresql@15/bin/psql -l
```

---

## 📝 下一步：配置项目

### 1. 创建 .env 文件

在项目根目录创建 `.env` 文件：

```bash
cd /Users/chenzilong/personal-site
touch .env
```

### 2. 配置数据库连接字符串

编辑 `.env` 文件，添加以下内容：

```env
# PostgreSQL 连接字符串
# 注意：如果 PostgreSQL 没有设置密码，用户名就是你的系统用户名
DATABASE_URL="postgresql://chenzilong@localhost:5432/personal_site?schema=public"

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

**重要提示：**
- 如果 PostgreSQL 设置了密码，格式为：`postgresql://用户名:密码@localhost:5432/personal_site?schema=public`
- 如果没有设置密码（默认情况），使用上面的格式即可

### 3. 测试数据库连接

```bash
# 测试连接（如果已添加到 PATH）
psql personal_site

# 或使用完整路径
/opt/homebrew/opt/postgresql@15/bin/psql personal_site

# 如果连接成功，会看到提示符：personal_site=#
# 输入 \q 退出
```

### 4. 生成 Prisma Client 并运行迁移

```bash
# 在项目根目录执行
cd /Users/chenzilong/personal-site

# 生成 Prisma Client
npx prisma generate

# 创建数据库表
npx prisma migrate dev --name init

# 或者直接推送（不创建迁移文件）
npx prisma db push
```

### 5. 验证设置

```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:3000/blog
# 应该能看到文章列表（如果数据库为空，会回退到文件系统）
```

---

## 🛠 常用 PostgreSQL 命令

### 连接数据库
```bash
# 如果已添加到 PATH
psql personal_site

# 或使用完整路径
/opt/homebrew/opt/postgresql@15/bin/psql personal_site
```

### 列出所有数据库
```bash
psql -l
# 或
/opt/homebrew/opt/postgresql@15/bin/psql -l
```

### 创建数据库
```bash
createdb 数据库名
# 或
/opt/homebrew/opt/postgresql@15/bin/createdb 数据库名
```

### 删除数据库
```bash
dropdb 数据库名
# 或
/opt/homebrew/opt/postgresql@15/bin/dropdb 数据库名
```

### 使用 Prisma Studio 管理数据（推荐）
```bash
npx prisma studio
```
这会打开一个网页界面，可以在浏览器中查看和编辑数据库数据。

---

## 🐛 常见问题

### 问题：连接数据库时提示需要密码

**解决方案：**
1. 检查 PostgreSQL 是否设置了密码
2. 如果没有设置密码，确保连接字符串中不包含密码部分
3. 如果设置了密码，在连接字符串中添加密码

### 问题：权限错误

**解决方案：**
```bash
# 确保当前用户有权限访问数据库
# 如果使用默认安装，通常当前用户（chenzilong）已经有权限
```

### 问题：数据库不存在

**解决方案：**
```bash
# 重新创建数据库
/opt/homebrew/opt/postgresql@15/bin/createdb personal_site
```

---

## 📚 下一步

配置完成后，可以：
1. 运行数据库迁移，创建表结构
2. 迁移现有的 Markdown 文章到数据库
3. 开始使用数据库存储文章

详细说明请参考 `SETUP_DATABASE.md`。

