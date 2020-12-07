import Link from "next/link";
import classnames from "classnames";
import styles from "./styles/Post.module.scss";
import PropTypes from "prop-types";
import { formatDate } from "utils/datetime";
import Card from "./Card";
import Tag from "./Tag";
import { memo } from "react";

export const List = memo(function List(props) {
  const { className, inline } = props;
  return (
    <ul className={classnames(styles.list, inline && styles.inline, className)}>
      {props.children}
    </ul>
  );
});

export const Item = memo(function Item({ post }) {
  const { name, metadata, stat, group } = post;
  return (
    <Card as="li" className={styles.item}>
      <div className={styles.block}>
        <div className={styles.meta}>
          <Link
            href={{
              pathname: "/post/[group]/[name]",
              query: {
                name,
                group: group.name,
              },
            }}
          >
            <a>
              <h3 className={styles.title}>{metadata.title}</h3>
            </a>
          </Link>
          <div className={styles.date}>最後更新：{formatDate(stat.mtime)}</div>
          <div className={styles.date}>
            類別：
            <Tag variant="emphasis" color="white">
              <Link
                href={{
                  pathname: "/post/[group]",
                  query: {
                    group: group.name,
                  },
                }}
              >
                <a>{group.display}</a>
              </Link>
            </Tag>
          </div>
          <div className={styles.tags}>
            {metadata.tags?.map((tag) => (
              <Tag key={tag} variant="main" color="white">
                <Link
                  href={{
                    pathname: "/post/[group]",
                    query: {
                      group: group.name,
                      tags: tag,
                    },
                  }}
                >
                  <a>{tag}</a>
                </Link>
              </Tag>
            ))}
          </div>
        </div>
        {metadata.image && (
          <div
            className={styles.imageBolck}
            style={{
              backgroundImage: `url(${metadata.image})`,
            }}
          ></div>
        )}
      </div>
      <div className={styles.preview}>
        {metadata.preview}
        <div className={styles.go}>
          <Link
            href={{
              pathname: "/post/[group]/[name]",
              query: {
                name,
                group: group.name,
              },
            }}
          >
            <a>繼續閱讀》</a>
          </Link>
        </div>
      </div>
    </Card>
  );
});

export const Metadata = memo(function Metadata({ metadata, group }) {
  return (
    <>
      <div className={styles.metadata}>
        <div
          className={styles.bg}
          style={{
            backgroundImage: `url(${metadata.image})`,
          }}
        ></div>
        <canvas width="2" height="1" />
        <div className={styles.metatext}>
          <h1>{metadata.title}</h1>
          <div className={styles.groupTag}>
            <Tag variant="emphasis" color="white">
              <Link
                href={{
                  pathname: "/post/[group]",
                  query: {
                    group: group.name,
                  },
                }}
              >
                {group.display}
              </Link>
            </Tag>
          </div>
          <div>
            {metadata.tags?.map((tag) => (
              <Tag key={tag} variant="main" color="white">
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      </div>
      <div>{metadata.preview}</div>
    </>
  );
});

export default {
  List,
  Item,
  Metadata,
};

Item.propTypes = {
  post: PropTypes.object.isRequired,
};
