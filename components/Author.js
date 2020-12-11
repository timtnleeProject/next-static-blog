import Image from "next/image";
import { AUTHOR } from "setting";
import classnames from "classnames";
import styles from "./styles/Author.module.scss";

export function Author(props) {
  const { author, className } = props;
  const { image, name } = AUTHOR[author];
  return (
    <div className={classnames(styles.author, className)}>
      <span>作者：</span>
      <div className={styles.avatar}>
        <Image src={image || "404"} width="30px" height="30px" alt={name} />
      </div>
      <div>{name}</div>
    </div>
  );
}
