import { Metadata } from "next";
import { PageProps } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "../../../lib/api";
import { CMS_NAME } from "../../../lib/constants";
import markdownToHtml from "../../../lib/markdownToHtml";
import Alert from "../../_components/alert";
import Container from "../../_components/container";
import Header from "../../_components/header";
import { PostBody } from "../../_components/post-body";
import { PostHeader } from "../../_components/post-header";

export default async function Post({ params }: PageProps<{ slug: string }>) {
  let post;
  
  try {
    post = getPostBySlug(params.slug);
  } catch (error) {
    console.error(`Failed to load post: ${params.slug}`, error);
    return notFound();
  }

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <main>
      <Alert preview={post.preview} />
      <Container>
        <Header />
        <article className="mb-32">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />
          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}

export function generateMetadata({ params }: PageProps<{ slug: string }>): Metadata {
  let post;
  
  try {
    post = getPostBySlug(params.slug);
  } catch (error) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.'
    };
  }

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.'
    };
  }

  const title = `${post.title} | Next.js Blog Example with ${CMS_NAME}`;

  return {
    openGraph: {
      title,
      images: [post.ogImage.url],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
