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
  draft?: boolean;
  content: string;
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
      draft: !post.published,
      content: post.content,
    }));
  } catch (error) {
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

// 主函数：优先使用数据库，如果数据库为空则使用文件系统
export async function getAllPosts(): Promise<Post[]> {
  const dbPosts = await getAllPostsFromDB();

  // 如果数据库有数据，使用数据库
  if (dbPosts.length > 0) {
    return dbPosts;
  }

  // 否则使用文件系统（用于迁移期间）
  return getAllPostsFromFS();
}

// 从数据库获取单篇文章
async function getPostBySlugFromDB(slug: string): Promise<Post | null> {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug,
        published: true,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    return {
      slug: post.slug,
      title: post.title,
      date: post.date.toISOString(),
      summary: post.summary || '',
      tags: post.tags.map((pt) => pt.tag.name),
      draft: !post.published,
      content: post.content,
    };
  } catch (error) {
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

      return {
        slug,
        title: data.title || "",
        date: data.date || "",
        summary: data.summary || "",
        tags: data.tags || [],
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
export async function getPostWithAuthorBySlug(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug,
        published: true,
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

    if (!post) {
      return null;
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
  } catch (error) {
    return null;
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

    if (posts.length > 0) {
      return posts.map((post) => post.slug);
    }

    // 如果数据库为空，使用文件系统
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
      .map((fileName) => fileName.replace(/\.(md|mdx)$/, ""));
  } catch (error) {

    // 回退到文件系统
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
      .map((fileName) => fileName.replace(/\.(md|mdx)$/, ""));
  }
}
