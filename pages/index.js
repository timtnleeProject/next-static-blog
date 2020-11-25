import Head from "next/head";
import { getPosts } from "data";
import Post from "components/Post";

export default function Home(props) {
  const { posts = [] } = props;
  return (
    <div>
      <Head>
        <title>HOME</title>
      </Head>

      <div>Post:</div>
      {posts.map((post) => (
        <Post.Item key={post.name} post={post}></Post.Item>
      ))}

      <footer>footer</footer>
    </div>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      posts: getPosts(),
    },
  };
}
