import { Post } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Ensure all required fields are strings and handle missing values
  const processedData = {
    ...data,
    title: String(data.title || ''),
    excerpt: String(data.excerpt || ''),
    author: data.author || { name: 'Unknown', picture: '/assets/blog/authors/jj.jpeg' },
    date: data.date instanceof Date ? data.date.toISOString() : String(data.date || new Date().toISOString()),
    coverImage: String(data.coverImage || '/assets/blog/hello-world/cover.jpg'),
    ogImage: data.ogImage || { url: String(data.coverImage || '/assets/blog/hello-world/cover.jpg') }
  };

  return { ...processedData, slug: realSlug, content } as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
