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
    <li>
      <Link
        href={{
          pathname: "/post/[name]",
          query: {
            name,
          },
        }}
      >
        <a>
          <Card className={styles.item}>
            <div className={styles.meta}>
              <h3 className={styles.title}>{metadata.title}</h3>
              <div>last upt：{formatDate(stat.mtime)}</div>
              <div className={styles.tags}>
                {metadata.tags?.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <div
              className={styles.imageBolck}
              style={{
                backgroundImage: `url(${metadata.image})`,
              }}
            ></div>
          </Card>
        </a>
      </Link>
    </li>
  );
}

export default {
  List,
  Item,
};

Item.propTypes = {
  post: PropTypes.object.isRequired,
};
