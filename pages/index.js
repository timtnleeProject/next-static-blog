import Head from "next/head";
import { getPosts } from "data";
import Post from "components/Post";

export default function Home(props) {
  const { posts = [] } = props;
  return (
    <>
      <Head>
        <title>HOME</title>
      </Head>

      <Post.List className="g-mr-auto">
        {posts.map((post) => (
          <Post.Item key={post.name} post={post}></Post.Item>
        ))}
      </Post.List>

      <footer>footer</footer>
    </>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      posts: getPosts(),
    },
  };
}
