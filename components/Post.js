import Link from "next/link";
import classnames from "classnames";
import styles from "./styles/Post.module.scss";
import PropTypes from "prop-types";
import { formatDate } from "utils/datetime";
import Card from "./Card";
import Tag from "./Tag";
import Author from "./Author";

export const List = function List(props) {
  const { className, inline } = props;
  return (
    <ul className={classnames(styles.list, inline && styles.inline, className)}>
      {props.children}
    </ul>
  );
};

export const GroupTag = ({ group, ...rest }) => (
  <Tag variant="emphasis" color="white" border="white" {...rest}>
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
);

export const PostTag = ({ tag, group, ...rest }) => (
  <Tag variant="light" color="dark" border="dark" key={tag} {...rest}>
    <Link
      href={{
        pathname: "/post/[group]",
        query: {
          group: group.name,
          tags: tag,
        },
      }}
    >
      <a>#{tag}</a>
    </Link>
  </Tag>
);

export const Date = function Date({ post }) {
  const { metadata } = post;
  return (
    <div className={styles.date}>
      <span>
        發表日期：
        {formatDate(metadata.birthtime, ["YYYY/MM/DD"])}
      </span>
      <span>/</span>
      <span>
        最後更新：
        {formatDate(metadata.mtime, ["YYYY/MM/DD"])}
      </span>
    </div>
  );
};

export const VerticalList = function VerticalList(props) {
  const { className } = props;
  return <ul className={classnames(styles.verticalList, className)}>{props.children}</ul>;
};

export const VerticalItem = function VerticalItem({
  post = {},
  simple = false,
  className,
  children,
}) {
  const { name, metadata, group } = post;
  return (
    <Card
      as="li"
      className={classnames(styles.verticalItem, simple && styles.simple, className)}
    >
      {post.name ? (
        <>
          {metadata.image && (
            <div className={styles.imageBolck}>
              <div className={styles.pad}></div>
              <img src={metadata.image} alt={metadata.title} loading="lazy"></img>
              <Link
                href={{
                  pathname: "/post/[group]/[name]",
                  query: {
                    name,
                    group: group.name,
                  },
                }}
              >
                <a className={styles.titleBlock}>
                  <h2>{metadata.title}</h2>
                </a>
              </Link>
            </div>
          )}
          {!simple && (
            <>
              <Date post={post} />
              <div className={styles.group}>
                類別：
                <GroupTag group={group} />
              </div>
              <div className={styles.tags}>
                標籤：
                {metadata.tags?.map((tag) => (
                  <PostTag key={tag} tag={tag} group={group}></PostTag>
                ))}
              </div>
            </>
          )}
          <summary>{metadata.preview}</summary>
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
        </>
      ) : (
        children
      )}
    </Card>
  );
};

export const Item = function Item({ post }) {
  const { name, metadata, group } = post;
  return (
    <Card as="li" className={styles.item}>
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
          <h2 className={styles.title}>{metadata.title} 》</h2>
        </a>
      </Link>
      <div className={styles.block}>
        <div className={styles.meta}>
          <Date post={post} />
          <div className={styles.group}>
            類別：
            <GroupTag group={group} />
          </div>
          <div className={styles.tags}>
            標籤：
            {metadata.tags?.map((tag) => (
              <PostTag key={tag} tag={tag} group={group}></PostTag>
            ))}
          </div>
          <Author className={styles.author} author={metadata.author} />
        </div>
        {metadata.image && (
          <div className={styles.imageBolck}>
            <img src={metadata.image} alt={metadata.title} loading="lazy"></img>
          </div>
        )}
      </div>
      <div className={styles.preview}>
        <summary>{metadata.preview}</summary>
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
};

export const Metadata = function Metadata({ post }) {
  const { metadata, group } = post;
  return (
    <>
      <h1 className={styles.metatitle}>{metadata.title}</h1>
      <Date post={post} />
      <Author className={styles.author} author={metadata.author} />
      <div className={styles.metatext}>
        <div className={styles.groupTag}>
          類別：
          <GroupTag group={group} />
        </div>
        <div className={styles.tag}>
          標籤：
          {metadata.tags?.map((tag) => (
            <PostTag key={tag} tag={tag} group={group} />
          ))}
        </div>
      </div>
      {metadata.image && (
        <img
          className={styles.metaImg}
          src={metadata.image}
          alt={metadata.title}
          loading="lazy"
        ></img>
      )}
      <div className={styles.hr} />
    </>
  );
};

export default {
  List,
  Item,
  VerticalList,
  VerticalItem,
  Metadata,
};

Item.propTypes = {
  post: PropTypes.object.isRequired,
};
