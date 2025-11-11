import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

export function getAllPosts(): Post[] {
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

export function getPostBySlug(slug: string): Post | null {
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

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.(md|mdx)$/, ""));
}

