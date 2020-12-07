import Page from "components/Page";
import Post from "components/Post";
import Tag from "components/Tag";
import { getGroups, getPostsByGroup, getTagsByGroup } from "data";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { GROUP } from "setting";

export default function GroupPost({ groupName, posts, tags }) {
  const router = useRouter();
  const activeTags = useMemo(() => router.query?.tags?.split?.(",") || [], [router]);
  const toggleTag = useCallback(
    (tag) => {
      const newTags = activeTags.slice();
      const i = activeTags.findIndex((t) => t === tag);
      if (i >= 0) {
        newTags.splice(i, 1);
      } else {
        newTags.push(tag);
      }
      router.push(
        {
          pathname: "/post/[group]",
          query: {
            group: groupName,
            tags: newTags,
          },
        },
        undefined,
        { shallow: true },
      );
    },
    [activeTags, groupName, router],
  );
  return (
    <Page.Content>
      <h2>{GROUP[groupName]}</h2>
      {tags.map((tag) => (
        <Tag key={tag} color="white" onClick={() => toggleTag(tag)}>
          {tag}
        </Tag>
      ))}
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
