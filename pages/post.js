import { useEffect, useMemo, useRef, useState } from "react";
import { bread, BreadCrumb } from "components/BreadCrumb";
import Page from "components/Page";
import Post, { VerticalItem } from "components/Post";
import { SITE } from "../setting";
import { Wrap, Spinner } from "components/Loader";

export default function About({ posts: initPosts }) {
  const [posts, setPosts] = useState(initPosts);
  const [done, setDone] = useState(false);
  const breadcrumbs = useMemo(() => [bread.home, bread.post], []);

  const ref = useRef();
  useEffect(() => {
    let length = 6;
    let onViewPort = false;
    let processing = false;
    const append = () => {
      console.log("FETCH POST");
      fetch(`/api/post?start=${length}&length=6`)
        .then((res) => res.json())
        .then((newPosts) => {
          length += newPosts.length;
          setPosts((p) => p.concat(newPosts));
          if (newPosts.length < 6) {
            console.log("STOP LOAD MORE");
            observer.unobserve(ref.current);
            setDone(true);
            return;
          }
          if (onViewPort) {
            append();
          } else {
            console.log("STOP");
            processing = false;
          }
        });
    };
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      onViewPort = entry.isIntersecting;
      if (processing) return;
      if (entry.isIntersecting) {
        processing = true;
        append();
      }
    });
    observer.observe(ref.current);
  }, []);

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
      {!done && (
        <Wrap>
          <div ref={ref} style={{ minHeight: "100px" }}></div>
          <Spinner />
        </Wrap>
      )}
    </Page.Content>
  );
}

export async function getServerSideProps(context) {
  const host = process.env.NODE_ENV === "production" ? SITE.url : "http://localhost:3000";
  const posts = await fetch(`${host}/api/post?start=0&length=6`).then((res) =>
    res.json(),
  );
  return {
    props: {
      posts,
    },
  };
}
