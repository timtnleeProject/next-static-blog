import Page from "components/Page";
import Post from "components/Post";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import PageMetadata from "components/PageMetadata";
import Loader from "components/Loader";
import SearchBar from "components/SearchBar";

export default function GroupPost() {
  const router = useRouter();
  const text = useMemo(() => {
    return router.query?.text || "";
  }, [router]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (text) {
      setLoading(true);
      fetch(`/api/search?text=${encodeURIComponent(text)}`)
        .then((res) => res.json())
        .then((res) => {
          setPosts(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [text]);

  const title = text ? `搜尋文章： ${text}` : "搜尋文章";
  return (
    <Page.Content>
      <PageMetadata title={title} description={title} />
      <Page.Title>搜尋文章</Page.Title>
      <Page.CenterSection>
        <small className="g-color-grey-2">僅搜尋標題、大綱、標籤。不包含內文。</small>
        <SearchBar disabled={loading} defaultValue={text} />
        <div className="g-color-grey-2 g-mt-3 g-mb-6">
          {text ? `搜尋「${text}」：共 ${posts.length} 篇文章` : "請輸入文字查找文章"}
        </div>
      </Page.CenterSection>
      <Loader.Wrap>
        <Post.VerticalList>
          {posts.map((post) => (
            <Post.VerticalItem key={post.name} post={post} />
          ))}
        </Post.VerticalList>
        {loading && <Loader.Spinner></Loader.Spinner>}
      </Loader.Wrap>
    </Page.Content>
  );
}
