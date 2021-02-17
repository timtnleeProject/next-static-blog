import React, { useState, useEffect } from "react";
import Card, { CardTitle } from "components/Card";
import Loader from "components/Loader";
import classnames from "classnames";
import styles from "./NewPosts.module.scss";
import Link from "next/link";

export default function NewPosts() {
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    fetch("/api/post?start=0&length=5")
      .then((res) => res.json())
      .then((res) => {
        setPosts(res);
      });
  }, []);
  return (
    <Loader.Wrap>
      <Card className={classnames("g-my-2", styles.group, styles.sm)}>
        <CardTitle as="h3">最新文章</CardTitle>
        {posts ? (
          <>
            <ol>
              {posts.map((post, i) => (
                <li key={i}>
                  <Link
                    href={{
                      pathname: "/post/[group]/[name]",
                      query: {
                        group: post.group.name,
                        name: post.name,
                      },
                    }}
                  >
                    <a>{post.metadata.title}</a>
                  </Link>
                </li>
              ))}
            </ol>
            <div className={styles.more}>
              <Link
                href={{
                  pathname: "/post",
                }}
              >
                <a>全部文章》</a>
              </Link>
            </div>
          </>
        ) : (
          <Loader.Spinner />
        )}
      </Card>
    </Loader.Wrap>
  );
}
