import Link from "next/link";
import styles from "./Post.module.scss";
import PropTypes from "prop-types";

export function List() {
  return <div>223</div>;
}

export function Item({ post }) {
  console.log(post);
  const { name, metadata } = post;
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
        <div>{name}</div>
        <div>
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
