import Head from "next/head";
import { getPosts } from "data";
import Post from "components/Post";
import Page from "components/Page";

export default function Home(props) {
  const { posts = [] } = props;
  return (
    <Page.Content>
      <Head>
        <title>HOME</title>
      </Head>
      <Post.List>
        {posts.map((post) => (
          <Post.Item key={post.name} post={post} />
        ))}
      </Post.List>
    </Page.Content>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      posts: getPosts(),
    },
  };
}
