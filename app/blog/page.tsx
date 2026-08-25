import { Suspense } from "react";
import BlogListNew from "@/components/BlogListNew";
import BlogListLoading from "@/app/blog/loading";
import { getBlogPageData } from "@/lib/posts";

export default async function BlogPage() {
  const initialData = await getBlogPageData();

  return (
    <Suspense fallback={<BlogListLoading />}>
      <BlogListNew initialData={initialData} />
    </Suspense>
  );
}
