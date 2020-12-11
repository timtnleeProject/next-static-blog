import { getPosts } from "data";
import Post from "components/Post";
import Page from "components/Page";
import PageMetadata from "components/PageMetadata";

export default function Home(props) {
  const title = "HOME";
  const { posts = [] } = props;
  return (
    <Page.Content>
      <PageMetadata
        title={title}
        description="A page's description, usually one or two sentences."
      />
      <h2>最近發表</h2>
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
