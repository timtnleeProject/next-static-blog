import Link from "next/link";
import styles from "./styles/Post.module.scss";
import PropTypes from "prop-types";
import { formatDate } from "utils/datetime";
import Card from "./Card";

export function List(props) {
  return <ul className={styles.list}>{props.children}</ul>;
}

export function Item({ post }) {
  const { name, metadata, stat } = post;
  return (
    <li className={styles.item}>
      <Link
        href={{
          pathname: "/post/[name]",
          query: {
            name,
          },
        }}
      >
        <a>
          <Card className={styles.block}>
            <div className={styles.meta}>
              <h3 className={styles.title}>{metadata.title}</h3>
              <div>last upt：{formatDate(stat.mtime)}</div>
              <div className={styles.tags}>
                {metadata.tags?.map((tag) => (
                  <span key={tag}>{tag}</span>
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
          </Card>
        </a>
      </Link>
    </li>
  );
}

export function Metadata({ metadata }) {
  return (
    <div
      className={styles.metadata}
      style={{
        backgroundImage: `url(${metadata.image})`,
      }}
    >
      <canvas width="2" height="1" />
      <div className={styles.metatext}>
        <h1>{metadata.title}</h1>
      </div>
    </div>
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
