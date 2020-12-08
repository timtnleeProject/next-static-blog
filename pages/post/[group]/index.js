import Page from "components/Page";
import Post from "components/Post";
import Tag from "components/Tag";
import styles from "styles/group.module.scss";
import { getGroups, getPostsByGroup, getTagsByGroup } from "data";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";
import { GROUP } from "setting";

export default function GroupPost({ groupName, posts, tags }) {
  const router = useRouter();
  const activeTags = useMemo(
    () => router.query?.tags?.split?.(",").filter((t) => t) || [],
    [router],
  );
  const toggleTag = useCallback(
    (tag) => {
      const newTags = activeTags.slice();
      const i = activeTags.findIndex((t) => t === tag);
      if (i >= 0) {
        newTags.splice(i, 1);
      } else {
        newTags.push(tag);
      }
      const query = {
        group: groupName,
      };
      if (newTags.length) {
        query.tags = newTags.join(",");
      }
      router.replace(
        {
          pathname: "/post/[group]",
          query,
        },
        undefined,
        { shallow: true },
      );
    },
    [activeTags, groupName, router],
  );

  const filteredPosts = useMemo(() => {
    if (activeTags.length)
      return posts.filter((post) => activeTags.some((tag) => post.tagMap[tag]));
    return posts;
  }, [posts, activeTags]);

  // If wrong tags applyed, reset.
  useEffect(() => {
    if (filteredPosts.length === 0)
      router.replace(
        {
          pathname: "/post/[group]",
          query: {
            group: groupName,
          },
        },
        undefined,
        { shallow: true },
      );
  }, [filteredPosts, groupName, router]);

  return (
    <Page.Content>
      <h2>「{GROUP[groupName]}」 相關文章</h2>
      <div className={styles.tags}>
        所有標籤：
        {tags.map((tag) => (
          <Tag
            key={tag}
            variant={activeTags.some((t) => t === tag) ? "main" : "light"}
            color="dark"
            onClick={() => toggleTag(tag)}
          >
            <a>#{tag}</a>
          </Tag>
        ))}
      </div>

      <Post.List>
        {filteredPosts.map((post) => (
          <Post.Item key={post.name} post={post} />
        ))}
      </Post.List>
    </Page.Content>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      posts: getPostsByGroup(context.params.group),
      tags: getTagsByGroup(context.params.group),
      groupName: context.params.group,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: getGroups().map(({ name }) => {
      return { params: { group: name } };
    }),
    fallback: false, // See the "fallback" section below
  };
}
