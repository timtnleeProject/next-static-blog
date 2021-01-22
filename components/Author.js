import { AUTHOR } from "setting";
import classnames from "classnames";
import styles from "./styles/Author.module.scss";
import React from "react";

export const Avatar = (props) => {
  const { author, className } = props;
  const { image, name } = AUTHOR[author];
  return (
    <div className={classnames(styles.avatar, className)}>
      <img src={image} alt={name} />
    </div>
  );
};

export default function Author(props) {
  const { author, className } = props;
  const { name } = AUTHOR[author];

  return (
    <div className={classnames(styles.author, className)}>
      <span>作者：</span>
      <Avatar author={author} className={styles.authorAvatar} />
      <div>{name}</div>
    </div>
  );
}
