# 博客数据修改指南

本文档提供修改数据库中博客文章的分类、标签、标题、摘要等数据的详细方法和示例。

## 📋 目录

- [修改文章分类](#修改文章分类)
- [修改文章标签](#修改文章标签)
- [修改文章基本信息](#修改文章基本信息)
- [批量操作](#批量操作)
- [使用脚本](#使用脚本)
- [使用 SQL](#使用-sql)
- [使用 Prisma Studio](#使用-prisma-studio)

---

## 修改文章分类

### 方法一：使用 TypeScript 脚本（推荐）

创建一个脚本文件 `scripts/update-post-category.ts`：

```typescript
import { prisma } from '../lib/prisma'

async function updatePostCategory() {
  try {
    // 根据 slug 更新分类
    const post = await prisma.post.update({
      where: { slug: 'improve-expression-skills' },
      data: { category: 'life' }, // 'tech' 或 'life'
    })

    console.log(`✅ 分类已更新: ${post.title} -> ${post.category === 'life' ? '生活记录' : '技术博客'}`)
  } catch (error) {
    console.error('❌ 更新失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updatePostCategory()
```

运行脚本：
```bash
npx tsx scripts/update-post-category.ts
```

### 方法二：使用 SQL 直接修改

```sql
-- 根据 slug 更新分类
UPDATE posts
SET category = 'life'
WHERE slug = 'improve-expression-skills';

-- 根据标题更新分类
UPDATE posts
SET category = 'tech'
WHERE title LIKE '%React%';

-- 批量更新：将所有包含"表达"的文章改为生活记录
UPDATE posts
SET category = 'life'
WHERE title LIKE '%表达%' OR summary LIKE '%表达%';
```

### 方法三：使用 Prisma Studio（图形界面）

```bash
# 启动 Prisma Studio
npx prisma studio
```

在浏览器中打开 `http://localhost:5555`，找到对应的文章，直接修改 `category` 字段。

---

## 修改文章标签

### 方法一：使用 TypeScript 脚本（推荐）

创建脚本 `scripts/update-post-tags.ts`：

```typescript
import { prisma } from '../lib/prisma'

async function updatePostTags() {
  try {
    const slug = 'improve-expression-skills'

    // 查找文章
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { tags: { include: { tag: true } } },
    })

    if (!post) {
      console.log('❌ 文章不存在')
      return
    }

    // 删除旧的标签关联
    await prisma.postTag.deleteMany({
      where: { postId: post.id },
    })

    // 新的标签列表
    const newTags = ['沟通技巧', '表达能力', '职场技能', '个人成长', '生活经验']

    // 创建或查找标签，并建立关联
    const tagConnections = await Promise.all(
      newTags.map(async (tagName: string) => {
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-')
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: {
            name: tagName,
            slug: tagSlug,
          },
        })
        return { id: tag.id }
      })
    )

    // 创建新的标签关联
    await Promise.all(
      tagConnections.map(tag =>
        prisma.postTag.create({
          data: {
            postId: post.id,
            tagId: tag.id,
          },
        })
      )
    )

    console.log(`✅ 标签已更新: ${post.title}`)
    console.log(`新标签: ${newTags.join(', ')}`)
  } catch (error) {
    console.error('❌ 更新失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updatePostTags()
```

运行脚本：
```bash
npx tsx scripts/update-post-tags.ts
```

### 方法二：使用 SQL 直接修改

```sql
-- 1. 查找文章 ID
SELECT id, title FROM posts WHERE slug = 'improve-expression-skills';

-- 2. 查找标签 ID
SELECT id, name FROM tags WHERE name IN ('沟通技巧', '表达能力', '职场技能');

-- 3. 删除旧的标签关联
DELETE FROM post_tags
WHERE post_id = '文章ID';

-- 4. 添加新的标签关联
INSERT INTO post_tags (id, post_id, tag_id)
VALUES
  (gen_random_uuid(), '文章ID', '标签1ID'),
  (gen_random_uuid(), '文章ID', '标签2ID'),
  (gen_random_uuid(), '文章ID', '标签3ID');
```

### 方法三：添加单个标签

```typescript
import { prisma } from '../lib/prisma'

async function addTagToPost() {
  try {
    const postSlug = 'improve-expression-skills'
    const tagName = '新标签'

    // 查找文章
    const post = await prisma.post.findUnique({
      where: { slug: postSlug },
    })

    if (!post) {
      console.log('❌ 文章不存在')
      return
    }

    // 创建或查找标签
    const tag = await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: {
        name: tagName,
        slug: tagName.toLowerCase().replace(/\s+/g, '-'),
      },
    })

    // 检查是否已关联
    const existingRelation = await prisma.postTag.findUnique({
      where: {
        postId_tagId: {
          postId: post.id,
          tagId: tag.id,
        },
      },
    })

    if (!existingRelation) {
      // 创建关联
      await prisma.postTag.create({
        data: {
          postId: post.id,
          tagId: tag.id,
        },
      })
      console.log(`✅ 标签已添加: ${tagName}`)
    } else {
      console.log(`⏭️  标签已存在: ${tagName}`)
    }
  } catch (error) {
    console.error('❌ 操作失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTagToPost()
```

---

## 修改文章基本信息

### 修改标题、摘要、日期等

创建脚本 `scripts/update-post-info.ts`：

```typescript
import { prisma } from '../lib/prisma'

async function updatePostInfo() {
  try {
    const slug = 'improve-expression-skills'

    const post = await prisma.post.update({
      where: { slug },
      data: {
        title: '新标题',
        summary: '新摘要',
        date: new Date('2025-01-20'),
        published: true, // 或 false
        // category: 'life', // 可选：同时修改分类
      },
    })

    console.log(`✅ 文章已更新: ${post.title}`)
  } catch (error) {
    console.error('❌ 更新失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updatePostInfo()
```

### 使用 SQL 修改

```sql
-- 修改标题和摘要
UPDATE posts
SET
  title = '新标题',
  summary = '新摘要',
  date = '2025-01-20',
  published = true
WHERE slug = 'improve-expression-skills';

-- 修改发布日期
UPDATE posts
SET date = '2025-01-20'
WHERE slug = 'improve-expression-skills';

-- 发布/取消发布
UPDATE posts
SET published = true
WHERE slug = 'improve-expression-skills';
```

---

## 批量操作

### 批量修改分类

创建脚本 `scripts/batch-update-category.ts`：

```typescript
import { prisma } from '../lib/prisma'

async function batchUpdateCategory() {
  try {
    // 批量更新：将所有包含"表达"的文章改为生活记录
    const result = await prisma.post.updateMany({
      where: {
        OR: [
          { title: { contains: '表达', mode: 'insensitive' } },
          { summary: { contains: '表达', mode: 'insensitive' } },
        ],
      },
      data: {
        category: 'life',
      },
    })

    console.log(`✅ 已更新 ${result.count} 篇文章`)
  } catch (error) {
    console.error('❌ 批量更新失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

batchUpdateCategory()
```

### 批量添加标签

```typescript
import { prisma } from '../lib/prisma'

async function batchAddTag() {
  try {
    const tagName = '新标签'
    const postSlugs = ['post-1', 'post-2', 'post-3']

    // 创建或查找标签
    const tag = await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: {
        name: tagName,
        slug: tagName.toLowerCase().replace(/\s+/g, '-'),
      },
    })

    // 查找所有文章
    const posts = await prisma.post.findMany({
      where: { slug: { in: postSlugs } },
    })

    // 批量创建标签关联
    const connections = await Promise.all(
      posts.map(post =>
        prisma.postTag.upsert({
          where: {
            postId_tagId: {
              postId: post.id,
              tagId: tag.id,
            },
          },
          update: {},
          create: {
            postId: post.id,
            tagId: tag.id,
          },
        })
      )
    )

    console.log(`✅ 已为 ${connections.length} 篇文章添加标签: ${tagName}`)
  } catch (error) {
    console.error('❌ 批量操作失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

batchAddTag()
```

---

## 使用脚本

### 创建通用更新脚本

创建 `scripts/update-post.ts`，支持命令行参数：

```typescript
import { prisma } from '../lib/prisma'

async function updatePost() {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.log('用法: npx tsx scripts/update-post.ts <slug> <操作> [参数]')
    console.log('操作:')
    console.log('  category <tech|life>  - 修改分类')
    console.log('  tags <tag1,tag2,...>  - 修改标签（逗号分隔）')
    console.log('  title <新标题>        - 修改标题')
    console.log('  summary <新摘要>      - 修改摘要')
    console.log('  publish <true|false>  - 发布/取消发布')
    process.exit(1)
  }

  const [slug, operation, ...values] = args
  const value = values.join(' ')

  try {
    await prisma.$connect()

    const post = await prisma.post.findUnique({
      where: { slug },
      include: { tags: true },
    })

    if (!post) {
      console.log(`❌ 文章不存在: ${slug}`)
      process.exit(1)
    }

    switch (operation) {
      case 'category':
        if (value !== 'tech' && value !== 'life') {
          console.log('❌ 分类必须是 tech 或 life')
          process.exit(1)
        }
        await prisma.post.update({
          where: { slug },
          data: { category: value },
        })
        console.log(`✅ 分类已更新: ${value === 'life' ? '生活记录' : '技术博客'}`)
        break

      case 'tags':
        // 删除旧标签
        await prisma.postTag.deleteMany({
          where: { postId: post.id },
        })

        // 创建新标签关联
        const tagNames = value.split(',').map(t => t.trim())
        const tagConnections = await Promise.all(
          tagNames.map(async (tagName: string) => {
            const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-')
            const tag = await prisma.tag.upsert({
              where: { name: tagName },
              update: {},
              create: {
                name: tagName,
                slug: tagSlug,
              },
            })
            return tag.id
          })
        )

        await Promise.all(
          tagConnections.map(tagId =>
            prisma.postTag.create({
              data: {
                postId: post.id,
                tagId,
              },
            })
          )
        )
        console.log(`✅ 标签已更新: ${tagNames.join(', ')}`)
        break

      case 'title':
        await prisma.post.update({
          where: { slug },
          data: { title: value },
        })
        console.log(`✅ 标题已更新: ${value}`)
        break

      case 'summary':
        await prisma.post.update({
          where: { slug },
          data: { summary: value },
        })
        console.log(`✅ 摘要已更新: ${value}`)
        break

      case 'publish':
        const published = value === 'true'
        await prisma.post.update({
          where: { slug },
          data: { published },
        })
        console.log(`✅ 发布状态已更新: ${published ? '已发布' : '草稿'}`)
        break

      default:
        console.log(`❌ 未知操作: ${operation}`)
        process.exit(1)
    }
  } catch (error) {
    console.error('❌ 操作失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

updatePost()
```

使用示例：

```bash
# 修改分类
npx tsx scripts/update-post.ts improve-expression-skills category life

# 修改标签
npx tsx scripts/update-post.ts improve-expression-skills tags "沟通技巧,表达能力,职场技能"

# 修改标题
npx tsx scripts/update-post.ts improve-expression-skills title "新标题"

# 修改摘要
npx tsx scripts/update-post.ts improve-expression-skills summary "新摘要"

# 发布/取消发布
npx tsx scripts/update-post.ts improve-expression-skills publish true
```

---

## 使用 SQL

### 常用 SQL 查询和更新

```sql
-- 1. 查看所有文章及其分类
SELECT slug, title, category, published
FROM posts
ORDER BY date DESC;

-- 2. 查看文章的标签
SELECT p.title, t.name as tag_name
FROM posts p
JOIN post_tags pt ON p.id = pt.post_id
JOIN tags t ON pt.tag_id = t.id
WHERE p.slug = 'improve-expression-skills';

-- 3. 统计各分类的文章数量
SELECT
  COALESCE(category, 'tech') as category,
  COUNT(*) as count
FROM posts
WHERE published = true
GROUP BY category;

-- 4. 查找没有标签的文章
SELECT p.slug, p.title
FROM posts p
LEFT JOIN post_tags pt ON p.id = pt.post_id
WHERE pt.id IS NULL;

-- 5. 批量更新分类（根据标题关键词）
UPDATE posts
SET category = 'life'
WHERE (title LIKE '%表达%' OR title LIKE '%沟通%' OR title LIKE '%习惯%')
  AND category != 'life';

-- 6. 删除未使用的标签
DELETE FROM tags
WHERE id NOT IN (SELECT DISTINCT tag_id FROM post_tags);

-- 7. 查找重复的标签
SELECT name, COUNT(*) as count
FROM tags
GROUP BY name
HAVING COUNT(*) > 1;

-- 8. 合并重复标签（将旧标签的文章关联到新标签）
-- 假设要合并 "前端" 和 "前端开发" 为 "前端开发"
UPDATE post_tags pt1
SET tag_id = (
  SELECT id FROM tags WHERE name = '前端开发'
)
WHERE pt1.tag_id = (SELECT id FROM tags WHERE name = '前端')
  AND NOT EXISTS (
    SELECT 1 FROM post_tags pt2
    WHERE pt2.post_id = pt1.post_id
      AND pt2.tag_id = (SELECT id FROM tags WHERE name = '前端开发')
  );
```

---

## 使用 Prisma Studio

Prisma Studio 是一个图形界面工具，可以方便地查看和修改数据库数据。

### 启动 Prisma Studio

```bash
npx prisma studio
```

然后在浏览器中打开 `http://localhost:5555`。

### 操作步骤

1. **修改分类**：
   - 在左侧选择 `Post` 模型
   - 找到要修改的文章
   - 点击编辑，修改 `category` 字段为 `tech` 或 `life`
   - 保存

2. **修改标签**：
   - 在文章详情页，找到 `tags` 关联
   - 可以添加或删除标签关联
   - 注意：需要先在 `Tag` 模型中创建标签

3. **修改其他字段**：
   - 直接编辑对应字段
   - 保存即可

---

## 完整示例脚本

### 示例 1：修改单篇文章的分类和标签

```typescript
import { prisma } from '../lib/prisma'

async function updatePostExample() {
  try {
    const slug = 'improve-expression-skills'

    // 1. 查找文章
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { tags: { include: { tag: true } } },
    })

    if (!post) {
      console.log('❌ 文章不存在')
      return
    }

    console.log(`当前文章: ${post.title}`)
    console.log(`当前分类: ${post.category === 'life' ? '生活记录' : '技术博客'}`)
    console.log(`当前标签: ${post.tags.map(t => t.tag.name).join(', ')}`)

    // 2. 更新分类
    await prisma.post.update({
      where: { slug },
      data: { category: 'life' },
    })

    // 3. 删除旧标签
    await prisma.postTag.deleteMany({
      where: { postId: post.id },
    })

    // 4. 添加新标签
    const newTags = ['沟通技巧', '表达能力', '职场技能', '个人成长']
    const tagConnections = await Promise.all(
      newTags.map(async (tagName: string) => {
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-')
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: {
            name: tagName,
            slug: tagSlug,
          },
        })
        return tag.id
      })
    )

    await Promise.all(
      tagConnections.map(tagId =>
        prisma.postTag.create({
          data: {
            postId: post.id,
            tagId,
          },
        })
      )
    )

    console.log('\n✅ 更新完成！')
    console.log(`新分类: 生活记录`)
    console.log(`新标签: ${newTags.join(', ')}`)
  } catch (error) {
    console.error('❌ 更新失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updatePostExample()
```

### 示例 2：批量修改多篇文章

```typescript
import { prisma } from '../lib/prisma'

async function batchUpdatePosts() {
  try {
    // 要修改的文章 slug 列表
    const slugs = [
      'improve-expression-skills',
      'daily-habits-improvement',
      'my-health-experience',
    ]

    // 批量更新分类
    const result = await prisma.post.updateMany({
      where: {
        slug: { in: slugs },
      },
      data: {
        category: 'life',
      },
    })

    console.log(`✅ 已更新 ${result.count} 篇文章的分类为"生活记录"`)

    // 为所有文章添加统一标签
    const tagName = '生活记录'
    const tag = await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: {
        name: tagName,
        slug: tagName.toLowerCase().replace(/\s+/g, '-'),
      },
    })

    const posts = await prisma.post.findMany({
      where: { slug: { in: slugs } },
    })

    for (const post of posts) {
      // 检查是否已有该标签
      const existing = await prisma.postTag.findUnique({
        where: {
          postId_tagId: {
            postId: post.id,
            tagId: tag.id,
          },
        },
      })

      if (!existing) {
        await prisma.postTag.create({
          data: {
            postId: post.id,
            tagId: tag.id,
          },
        })
      }
    }

    console.log(`✅ 已为 ${posts.length} 篇文章添加标签: ${tagName}`)
  } catch (error) {
    console.error('❌ 批量更新失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

batchUpdatePosts()
```

---

## 注意事项

### 1. 备份数据

在进行批量操作前，建议先备份数据库：

```bash
# PostgreSQL 备份
pg_dump -U username -d database_name > backup.sql

# 或使用 Prisma Migrate
npx prisma migrate dev --create-only --name backup
```

### 2. 验证修改

修改后建议验证结果：

```typescript
import { prisma } from '../lib/prisma'

async function verifyPost() {
  const post = await prisma.post.findUnique({
    where: { slug: 'improve-expression-skills' },
    include: {
      tags: { include: { tag: true } },
    },
  })

  console.log('文章信息:')
  console.log(`标题: ${post?.title}`)
  console.log(`分类: ${post?.category === 'life' ? '生活记录' : '技术博客'}`)
  console.log(`标签: ${post?.tags.map(t => t.tag.name).join(', ')}`)
  console.log(`已发布: ${post?.published ? '是' : '否'}`)

  await prisma.$disconnect()
}

verifyPost()
```

### 3. 分类值说明

- `tech`: 技术博客
- `life`: 生活记录
- `null`: 默认为技术博客（在查询时会被归类为 tech）

### 4. 标签处理

- 标签名称是唯一的（`name` 字段）
- 标签 slug 也是唯一的（`slug` 字段）
- 修改标签时，需要先删除旧的关联，再创建新的关联
- 未使用的标签可以安全删除（不会影响已关联的文章）

---

## 故障排除

### 问题：找不到文章

**解决方案**：
```typescript
// 先查找所有文章
const posts = await prisma.post.findMany({
  select: { slug: true, title: true },
})
console.log('所有文章:', posts)
```

### 问题：标签关联失败

**解决方案**：
```typescript
// 检查标签是否存在
const tag = await prisma.tag.findUnique({
  where: { name: '标签名' },
})
if (!tag) {
  // 先创建标签
  await prisma.tag.create({
    data: {
      name: '标签名',
      slug: '标签slug',
    },
  })
}
```

### 问题：批量操作超时

**解决方案**：
- 分批处理，每次处理少量文章
- 使用事务确保数据一致性

---

## 相关文档

- [新增文章部署流程](./ADD_NEW_POST.md)
- [数据库设置指南](../setup/SETUP_DATABASE.md)
- [Prisma 官方文档](https://www.prisma.io/docs)

---

## 快速参考

### 常用命令

```bash
# 修改分类
npx tsx -e "import { prisma } from './lib/prisma'; (async () => { await prisma.post.update({ where: { slug: 'xxx' }, data: { category: 'life' } }); await prisma.\$disconnect(); })()"

# 查看文章信息
npx tsx -e "import { prisma } from './lib/prisma'; (async () => { const p = await prisma.post.findUnique({ where: { slug: 'xxx' }, include: { tags: { include: { tag: true } } } }); console.log(p); await prisma.\$disconnect(); })()"

# 启动 Prisma Studio
npx prisma studio
```

### 常用 SQL

```sql
-- 查看文章及其分类
SELECT slug, title, category FROM posts;

-- 查看文章标签
SELECT p.title, t.name
FROM posts p
JOIN post_tags pt ON p.id = pt.post_id
JOIN tags t ON pt.tag_id = t.id;

-- 更新分类
UPDATE posts SET category = 'life' WHERE slug = 'xxx';
```

---

完成以上操作后，你的博客数据就已经更新完成！

