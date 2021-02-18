import { getPosts } from "data";
import Post from "components/Post";
import Page from "components/Page";
import PageMetadata from "components/PageMetadata";
import { SITE } from "setting";
import Ads from "components/Ads";
import styles from "styles/Home.module.scss";
import { useMemo } from "react";

export default function Home(props) {
  const { posts = [] } = props;
  const postsWithAds = useMemo(() => {
    return posts.reduce((ary, post, i) => {
      if (i % 5 === 4) return ary.concat(["ads", post]);
      return ary.concat([post]);
    }, []);
  }, [posts]);
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
        {postsWithAds.map((post, i) =>
          post === "ads" ? (
            <div key={`ads-${i}`} className={styles.slot}>
              <Ads
                style={{ display: "block" }}
                data-ad-client="ca-pub-1331251306729236"
                data-ad-slot="6140475128"
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </div>
          ) : (
            <Post.VerticalItem key={i} post={post} />
          ),
        )}
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
