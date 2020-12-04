import Link from "next/link";
import classnames from "classnames";
import styles from "./styles/Post.module.scss";
import PropTypes from "prop-types";
import { formatDate } from "utils/datetime";
import Card from "./Card";
import Tag from "./Tag";

export function List(props) {
  const { className, inline } = props;
  return (
    <ul className={classnames(styles.list, inline && styles.inline, className)}>
      {props.children}
    </ul>
  );
}

export function Item({ post }) {
  const { name, metadata, stat } = post;
  return (
    <Card as="li" className={styles.item}>
      <Link
        href={{
          pathname: "/post/[name]",
          query: {
            name,
          },
        }}
      >
        <a>
          <div className={styles.block}>
            <div className={styles.meta}>
              <h3 className={styles.title}>{metadata.title}</h3>
              <div className={styles.date}>最後更新：{formatDate(stat.mtime)}</div>
              <div className={styles.tags}>
                {metadata.tags?.map((tag) => (
                  <Tag key={tag} variant="main" color="white">
                    {tag}
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
          <div className={styles.preview}>{metadata.preview}</div>
        </a>
      </Link>
    </Card>
  );
}

export function Metadata({ metadata }) {
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
          <div>Tags: 12333123123132</div>
        </div>
      </div>
      <div>{metadata.preview}</div>
    </>
  );
}

export default {
  List,
  Item,
  Metadata,
};

Item.propTypes = {
  post: PropTypes.object.isRequired,
};
