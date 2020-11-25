import Link from "next/link";
import styles from "./Post.module.scss";
import PropTypes from "prop-types";
import { formatDate } from "utils/datetime";

export function List() {
  return <div>223</div>;
}

export function Item({ post }) {
  console.log(post);
  const { name, metadata, stat } = post;
  return (
    <Link
      href={{
        pathname: "/post/[name]",
        query: {
          name,
        },
      }}
    >
      <a className={styles.item}>
        <h3 className={styles.item__title}>{metadata.title}</h3>
        <div>最後更新：{formatDate(stat.mtime)}</div>
        <div className={styles.item__tagwrap}>
          {metadata.tags?.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </a>
    </Link>
  );
}

export default {
  Item,
};

Item.propTypes = {
  post: PropTypes.object.isRequired,
};
