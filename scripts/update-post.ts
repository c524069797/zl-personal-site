import { prisma } from '../lib/prisma'

async function updatePost() {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.log('用法: npx tsx scripts/update-post.ts <slug> <操作> [参数]')
    console.log('\n操作:')
    console.log('  category <tech|life>     - 修改分类')
    console.log('  tags <tag1,tag2,...>     - 修改标签（逗号分隔）')
    console.log('  title <新标题>           - 修改标题')
    console.log('  summary <新摘要>         - 修改摘要')
    console.log('  publish <true|false>    - 发布/取消发布')
    console.log('  date <YYYY-MM-DD>       - 修改发布日期')
    console.log('\n示例:')
    console.log('  npx tsx scripts/update-post.ts improve-expression-skills category life')
    console.log('  npx tsx scripts/update-post.ts improve-expression-skills tags "沟通技巧,表达能力"')
    console.log('  npx tsx scripts/update-post.ts improve-expression-skills title "新标题"')
    process.exit(1)
  }

  const [slug, operation, ...values] = args
  const value = values.join(' ')

  try {
    await prisma.$connect()

    const post = await prisma.post.findUnique({
      where: { slug },
      include: { tags: { include: { tag: true } } },
    })

    if (!post) {
      console.log(`❌ 文章不存在: ${slug}`)
      process.exit(1)
    }

    console.log(`📝 文章: ${post.title}`)
    console.log(`当前分类: ${post.category === 'life' ? '生活记录' : '技术博客'}`)
    console.log(`当前标签: ${post.tags.map(t => t.tag.name).join(', ') || '无'}`)
    console.log('')

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
        const tagNames = value.split(',').map(t => t.trim()).filter(t => t)
        if (tagNames.length === 0) {
          console.log('❌ 标签不能为空')
          process.exit(1)
        }

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
        if (!value) {
          console.log('❌ 标题不能为空')
          process.exit(1)
        }
        await prisma.post.update({
          where: { slug },
          data: { title: value },
        })
        console.log(`✅ 标题已更新: ${value}`)
        break

      case 'summary':
        await prisma.post.update({
          where: { slug },
          data: { summary: value || null },
        })
        console.log(`✅ 摘要已更新: ${value || '(已清空)'}`)
        break

      case 'publish':
        const published = value === 'true'
        await prisma.post.update({
          where: { slug },
          data: { published },
        })
        console.log(`✅ 发布状态已更新: ${published ? '已发布' : '草稿'}`)
        break

      case 'date':
        if (!value) {
          console.log('❌ 日期不能为空，格式: YYYY-MM-DD')
          process.exit(1)
        }
        const date = new Date(value)
        if (isNaN(date.getTime())) {
          console.log('❌ 日期格式错误，请使用 YYYY-MM-DD 格式')
          process.exit(1)
        }
        await prisma.post.update({
          where: { slug },
          data: { date },
        })
        console.log(`✅ 日期已更新: ${value}`)
        break

      default:
        console.log(`❌ 未知操作: ${operation}`)
        console.log('支持的操作: category, tags, title, summary, publish, date')
        process.exit(1)
    }

    // 显示更新后的信息
    const updatedPost = await prisma.post.findUnique({
      where: { slug },
      include: { tags: { include: { tag: true } } },
    })

    console.log('\n📊 更新后的信息:')
    console.log(`标题: ${updatedPost?.title}`)
    console.log(`分类: ${updatedPost?.category === 'life' ? '生活记录' : '技术博客'}`)
    console.log(`标签: ${updatedPost?.tags.map(t => t.tag.name).join(', ') || '无'}`)
    console.log(`发布状态: ${updatedPost?.published ? '已发布' : '草稿'}`)
    console.log(`发布日期: ${updatedPost?.date.toISOString().split('T')[0]}`)
  } catch (error) {
    console.error('❌ 操作失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

updatePost()

