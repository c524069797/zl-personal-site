import { getAllPosts } from "@/lib/posts";
import Navigation from "@/components/Navigation";
import BlogList from "@/components/BlogList";

export const metadata = {
  title: "博客",
  description: "我的博客文章列表",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <Navigation />
      <BlogList posts={posts} />
    </>
  );
}
