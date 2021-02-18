import { getPosts } from "data";
import Post from "components/Post";
import Page from "components/Page";
import PageMetadata from "components/PageMetadata";
import { SITE } from "setting";

export default function Home(props) {
  const { posts = [] } = props;
  return (
    <Page.Content>
      <PageMetadata
        title={`${SITE.title} - ${SITE.subtitle}`}
        description="生活記錄、文章撰寫"
        home={true}
        image={`${SITE.url}/up.jpg`}
      />
      <Page.Title>最近發表</Page.Title>
      <Post.VerticalList>
        {posts.map((post, i) => (
          <Post.VerticalItem key={i} post={post} />
        ))}
      </Post.VerticalList>
    </Page.Content>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      posts: getPosts().slice(0, 6),
    },
  };
}
