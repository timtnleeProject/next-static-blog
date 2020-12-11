import { AUTHOR } from "setting";
import classnames from "classnames";
import styles from "./styles/Author.module.scss";
import React from "react";

export default function Author(props) {
  const { author, className } = props;
  const { image, name } = AUTHOR[author];
  return (
    <div className={classnames(styles.author, className)}>
      <span>作者：</span>
      <div className={styles.avatar}>
        <img src={image} alt={name} />
      </div>
      <div>{name}</div>
    </div>
  );
}
