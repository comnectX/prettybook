import { Post } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${realSlug}`);
  }
  
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Ensure all fields are properly typed and have safe defaults
  const post: Post = {
    slug: realSlug,
    title: typeof data.title === 'string' ? data.title : 'Untitled',
    excerpt: typeof data.excerpt === 'string' ? data.excerpt : '',
    date: data.date instanceof Date 
      ? data.date.toISOString() 
      : typeof data.date === 'string' 
        ? data.date 
        : new Date().toISOString(),
    coverImage: typeof data.coverImage === 'string' ? data.coverImage : '/assets/blog/hello-world/cover.jpg',
    author: typeof data.author === 'object' && data.author !== null
      ? {
          name: typeof data.author.name === 'string' ? data.author.name : 'Unknown Author',
          picture: typeof data.author.picture === 'string' ? data.author.picture : '/assets/blog/authors/jj.jpeg'
        }
      : typeof data.author === 'string'
        ? { name: data.author, picture: '/assets/blog/authors/jj.jpeg' }
        : { name: 'Unknown Author', picture: '/assets/blog/authors/jj.jpeg' },
    ogImage: {
      url: typeof data.ogImage?.url === 'string' 
        ? data.ogImage.url 
        : typeof data.coverImage === 'string' 
          ? data.coverImage 
          : '/assets/blog/hello-world/cover.jpg'
    },
    content: typeof content === 'string' ? content : '',
    preview: Boolean(data.preview)
  };

  return post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => {
      try {
        return getPostBySlug(slug);
      } catch (error) {
        console.warn(`Failed to load post: ${slug}`, error);
        return null;
      }
    })
    .filter((post): post is Post => post !== null)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  
  return posts;
}