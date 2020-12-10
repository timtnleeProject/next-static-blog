import { AUTHOR } from "setting";
import classnames from "classnames";
import styles from "./styles/Author.module.scss";

export function Author(props) {
  const { author, className } = props;
  return (
    <div className={classnames(styles.author, className)}>
      <span>作者：</span>
      <div className={styles.avatar}></div>
      <div>{AUTHOR[author]}</div>
    </div>
  );
}
