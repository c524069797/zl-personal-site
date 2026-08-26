import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { prisma } from "./prisma";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  category?: string;
  draft?: boolean;
  content: string;
}

export interface BlogListPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: Array<{ name: string; slug: string }>;
  commentCount: number;
  readingTime?: number;
  searchText?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
  color: string;
}

export interface BlogSidebarData {
  hotPosts: BlogListPost[];
  tags: BlogTag[];
  categories: BlogCategory[];
}

export interface BlogPageData extends BlogSidebarData {
  posts: BlogListPost[];
  total: number;
}

// 从数据库获取所有文章
async function getAllPostsFromDB(): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date.toISOString(),
      summary: post.summary || '',
      tags: post.tags.map((pt) => pt.tag.name),
      category: post.category || 'tech',
      draft: !post.published,
      content: post.content,
    }));
  } catch {
    // 如果数据库连接失败，回退到文件系统
    return [];
  }
}

// 从文件系统获取所有文章（后备方案）
function getAllPostsFromFS(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || "",
        date: data.date || "",
        summary: data.summary || "",
        tags: data.tags || [],
        category: data.category || "tech",
        draft: data.draft || false,
        content,
      };
    })
    .filter((post) => !post.draft)
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });

  return allPostsData;
}

function toBlogListPost(post: Post, id = `file:${post.slug}`): BlogListPost {
  return {
    id,
    slug: post.slug,
    title: post.title,
    date: post.date,
    summary: post.summary,
    category: post.category || 'tech',
    tags: post.tags.map((tag) => ({
      name: tag,
      slug: tag.toLowerCase().replace(/\s+/g, '-'),
    })),
    commentCount: 0,
    readingTime: Math.ceil((post.content?.length || 0) / 200),
    searchText: post.content,
  };
}

async function getBlogListPostsFromDB(): Promise<BlogListPost[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        date: true,
        summary: true,
        category: true,
        content: true,
        tags: {
          select: {
            tag: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: {
              where: {
                approved: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      date: post.date.toISOString(),
      summary: post.summary || '',
      category: post.category || 'tech',
      tags: post.tags.map(({ tag }) => tag),
      commentCount: post._count.comments,
      readingTime: Math.ceil((post.content?.length || 0) / 200),
      searchText: post.content,
    }));
  } catch {
    return [];
  }
}

function getBlogListPostsFromFS(): BlogListPost[] {
  return getAllPostsFromFS().map((post) => toBlogListPost(post));
}

function mergeBlogListPosts(dbPosts: BlogListPost[], filePosts: BlogListPost[]): BlogListPost[] {
  const postsBySlug = new Map(dbPosts.map((post) => [post.slug, post]));

  for (const filePost of filePosts) {
    if (!postsBySlug.has(filePost.slug)) {
      postsBySlug.set(filePost.slug, filePost);
    }
  }

  return Array.from(postsBySlug.values()).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

function buildBlogSidebarData(posts: BlogListPost[]): BlogSidebarData {
  const tagCounts = new Map<string, BlogTag>();
  const categoryCounts = new Map<string, BlogCategory>([
    ['tech', { id: 'tech', name: '技术博客', slug: 'tech', count: 0, color: '#1890ff' }],
    ['life', { id: 'life', name: '生活记录', slug: 'life', count: 0, color: '#52c41a' }],
  ]);

  for (const post of posts) {
    const category = post.category === 'life' ? 'life' : 'tech';
    const categoryData = categoryCounts.get(category);
    if (categoryData) categoryData.count += 1;

    for (const tag of post.tags) {
      const existingTag = tagCounts.get(tag.slug);
      if (existingTag) {
        existingTag.count += 1;
      } else {
        tagCounts.set(tag.slug, {
          id: `tag:${tag.slug}`,
          name: tag.name,
          slug: tag.slug,
          count: 1,
        });
      }
    }
  }

  const hotPosts = [...posts]
    .sort((a, b) => {
      const commentDiff = b.commentCount - a.commentCount;
      if (commentDiff !== 0) return commentDiff;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 5);

  return {
    hotPosts,
    tags: [...tagCounts.values()].sort((a, b) => b.count - a.count),
    categories: [...categoryCounts.values()],
  };
}

export function toPublicBlogListPost(post: BlogListPost): BlogListPost {
  const publicPost = { ...post };
  delete publicPost.searchText;
  return publicPost;
}

let allBlogListPostsPromise: Promise<BlogListPost[]> | null = null;

export function getAllBlogListPosts(): Promise<BlogListPost[]> {
  if (!allBlogListPostsPromise) {
    allBlogListPostsPromise = Promise.all([
      getBlogListPostsFromDB(),
      Promise.resolve(getBlogListPostsFromFS()),
    ]).then(([dbPosts, filePosts]) => mergeBlogListPosts(dbPosts, filePosts));
  }

  return allBlogListPostsPromise;
}

let blogPageDataPromise: Promise<BlogPageData> | null = null;

export function getBlogPageData(): Promise<BlogPageData> {
  if (!blogPageDataPromise) {
    blogPageDataPromise = getAllBlogListPosts().then((allPosts) => {
      const sidebarData = buildBlogSidebarData(allPosts);

      return {
        posts: allPosts.slice(0, 10).map(toPublicBlogListPost),
        total: allPosts.length,
        hotPosts: sidebarData.hotPosts.map(toPublicBlogListPost),
        tags: sidebarData.tags,
        categories: sidebarData.categories,
      };
    });
  }

  return blogPageDataPromise;
}

// 主函数：优先使用数据库，如果数据库为空则使用文件系统
export async function getAllPosts(): Promise<Post[]> {
  const dbPosts = await getAllPostsFromDB();
  const filePosts = getAllPostsFromFS();
  const postsBySlug = new Map(dbPosts.map((post) => [post.slug, post]));

  for (const filePost of filePosts) {
    if (!postsBySlug.has(filePost.slug)) {
      postsBySlug.set(filePost.slug, filePost);
    }
  }

  return Array.from(postsBySlug.values()).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// 从数据库获取单篇文章
async function getPostBySlugFromDB(slug: string): Promise<Post | null> {
  try {
    // findUnique 只能使用唯一字段，所以先查找 slug，再检查 published
    const post = await prisma.post.findUnique({
      where: {
        slug,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // 检查文章是否存在且已发布
    if (!post || !post.published) {
      return null;
    }

    return {
      slug: post.slug,
      title: post.title,
      date: post.date.toISOString(),
      summary: post.summary || '',
      tags: post.tags.map((pt) => pt.tag.name),
      category: post.category || 'tech',
      draft: !post.published,
      content: post.content,
    };
  } catch {
    return null;
  }
}

// 从文件系统获取单篇文章（后备方案）
function getPostBySlugFromFS(slug: string): Post | null {
  const possibleExtensions = [".md", ".mdx"];

  for (const ext of possibleExtensions) {
    const fullPath = path.join(postsDirectory, `${slug}${ext}`);
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      if (data.draft) {
        return null;
      }

      return {
        slug,
        title: data.title || "",
        date: data.date || "",
        summary: data.summary || "",
        tags: data.tags || [],
        category: data.category || "tech",
        draft: data.draft || false,
        content,
      };
    }
  }

  return null;
}

// 主函数：优先使用数据库，如果数据库没有则使用文件系统
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const dbPost = await getPostBySlugFromDB(slug);

  if (dbPost) {
    return dbPost;
  }

  // 如果数据库没有，尝试文件系统
  return getPostBySlugFromFS(slug);
}

// 从数据库获取单篇文章（包含作者信息）
function getFilePostWithAuthor(slug: string) {
  const filePost = getPostBySlugFromFS(slug);
  if (!filePost) return null;

  return {
    id: `file:${filePost.slug}`,
    slug: filePost.slug,
    title: filePost.title,
    date: filePost.date,
    summary: filePost.summary,
    tags: filePost.tags.map((tag) => ({
      name: tag,
      slug: tag.toLowerCase().replace(/\s+/g, '-'),
    })),
    content: filePost.content,
    author: null,
  };
}

export async function getPostWithAuthorBySlug(slug: string) {
  try {
    // findUnique 只能使用唯一字段，所以先查找 slug，再检查 published
    const post = await prisma.post.findUnique({
      where: {
        slug,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // 检查文章是否存在且已发布
    if (!post || !post.published) {
      return getFilePostWithAuthor(slug);
    }

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      date: post.date.toISOString(),
      summary: post.summary || '',
      tags: post.tags.map((pt) => ({
        name: pt.tag.name,
        slug: pt.tag.slug,
      })),
      content: post.content,
      author: post.author,
    };
  } catch {
    return getFilePostWithAuthor(slug);
  }
}

// 获取所有文章的 slug
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
      },
    });

    const fileSlugs = getAllPostsFromFS().map((post) => post.slug);
    return [...new Set([...posts.map((post) => post.slug), ...fileSlugs])];
  } catch {

    // 回退到文件系统
    return getAllPostsFromFS().map((post) => post.slug);
  }
}
