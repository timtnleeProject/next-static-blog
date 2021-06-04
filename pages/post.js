import { useCallback, useMemo, useRef, useState } from "react";
import { bread, BreadCrumb } from "components/BreadCrumb";
import Page from "components/Page";
import Post, { VerticalItem } from "components/Post";
import { Wrap, Spinner } from "components/Loader";
import { getGroups, getPosts } from "data";
import Link from "next/link";
import Tag from "components/Tag";
import useLazyLoadMorePosts from "hooks/useLazyLoadMorePosts";

const defaultPostsLength = 6;

export default function About({ posts: initPosts, groups }) {
  const [posts, setPosts] = useState(initPosts);
  const [done, setDone] = useState(false);
  const breadcrumbs = useMemo(() => [bread.home, bread.post], []);

  const total = useMemo(() => groups.reduce((sum, g) => sum + g.count, 0), [groups]);

  const ref = useRef();

  const api = useCallback(
    (total, length) =>
      fetch(`/api/post?start=${total}&length=${length}`).then((res) => res.json()),
    [],
  );
  useLazyLoadMorePosts({
    api,
    onResponse: (newPosts) => {
      setPosts((p) => p.concat(newPosts));
    },
    onDone: () => {
      setDone(true);
    },
    ref,
    start: defaultPostsLength,
    length: 6,
  });

  return (
    <Page.Content>
      <Page.CenterSection>
        <BreadCrumb links={breadcrumbs} />
        <Page.Title>文章</Page.Title>
        <div className="g-mb-6">
          類別：
          {groups.map((group) => (
            <Tag
              key={group.name}
              className="g-mt-2"
              color="emphasis"
              variant="white"
              border="emphasis"
              style={{ fontSize: "14px" }}
            >
              <Link
                className="g-mr-3"
                href={{
                  pathname: "/post/[group]",
                  query: {
                    group: group.name,
                  },
                }}
                passHref
              >
                <a>
                  {group.display}({group.count})
                </a>
              </Link>
            </Tag>
          ))}
        </div>
        <div className="g-color-grey-2 g-mt-3 g-mb-6">共 {total} 篇文章</div>
      </Page.CenterSection>
      <Post.VerticalList alignLeft>
        {posts.map((post) => (
          <VerticalItem key={post.group.name + post.name} simple post={post} />
        ))}
      </Post.VerticalList>
      {!done && (
        <Wrap>
          <div ref={ref} style={{ minHeight: "100px" }}></div>
          <Spinner />
        </Wrap>
      )}
    </Page.Content>
  );
}

export async function getStaticProps(context) {
  // const host = process.env.NODE_ENV === "production" ? SITE.url : "http://localhost:3000";
  // const posts = await fetch(`${host}/api/post?start=0&length=6`).then((res) =>
  //   res.json(),
  // );
  return {
    props: {
      posts: getPosts().slice(0, defaultPostsLength),
      groups: getGroups(),
    },
  };
}
