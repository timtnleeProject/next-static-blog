import Page from "components/Page";
import Post from "components/Post";
import Tag from "components/Tag";
import styles from "styles/Group.module.scss";
import { getGroups, getPostsByGroup, getTagsByGroup } from "data";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";
import { GROUP } from "setting";
import PageMetadata from "components/PageMetadata";
import { bread, BreadCrumb } from "components/BreadCrumb";
import classnames from "classnames";

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

  // UI
  const groupDisplay = GROUP[groupName];
  const title = useMemo(() => `「${groupDisplay}」 相關文章`, [groupDisplay]);
  const breadcrumbs = useMemo(
    () => [
      bread.home,
      bread.post,
      {
        frag: groupName,
        name: groupDisplay,
      },
    ],
    [groupName, groupDisplay],
  );
  return (
    <Page.Content>
      <PageMetadata title={title} description={title} />
      <Page.CenterSection>
        <BreadCrumb links={breadcrumbs} />
        <Page.Title>{title}</Page.Title>
        <div className={styles.tagWrap}>
          標籤篩選：
          {tags.map((tag) => (
            <Tag
              key={tag.name}
              className={styles.tag}
              variant={activeTags.some((t) => t === tag.name) ? "main" : "light"}
              color="dark"
              border="dark"
              onClick={() => toggleTag(tag.name)}
            >
              <a>
                #{tag.name} ({tag.count})
              </a>
            </Tag>
          ))}
        </div>
        <div className={classnames("g-color-grey-2", styles.total)}>
          共 {filteredPosts.length} 篇文章
        </div>
      </Page.CenterSection>
      <Post.VerticalList>
        {filteredPosts.map((post) => (
          <Post.VerticalItem key={post.name} post={post} />
        ))}
      </Post.VerticalList>
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
