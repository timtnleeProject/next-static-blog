import { bread, BreadCrumb } from "components/BreadCrumb";
import Page from "components/Page";
import Post, { VerticalItem } from "components/Post";
import { getPosts } from "data";
import { useMemo } from "react";

export default function About({ posts }) {
  const breadcrumbs = useMemo(() => [bread.home, bread.post], []);

  return (
    <Page.Content>
      <Page.CenterSection>
        <BreadCrumb links={breadcrumbs} />
        <Page.Title>文章</Page.Title>
      </Page.CenterSection>
      <Post.VerticalList>
        {posts.map((post) => (
          <VerticalItem key={post.group.name + post.name} simple post={post} />
        ))}
      </Post.VerticalList>
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
