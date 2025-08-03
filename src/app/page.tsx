import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts } from "../lib/api";

export default function Index() {
  const allPosts = getAllPosts();

  if (allPosts.length === 0) {
    return (
      <main>
        <Container>
          <Intro />
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">No posts found</h2>
            <p className="text-gray-600">Please add some blog posts to get started.</p>
          </div>
        </Container>
      </main>
    );
  }

  const heroPost = allPosts[0];

  const morePosts = allPosts.slice(1);

  return (
    <main>
      <Container>
        <Intro />
        <HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          author={heroPost.author}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
        />
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
    </main>
  );
}
