import styles from "./styles/Card.module.scss";
import classnames from "classnames";

export default function Card(props) {
  const { children, className, ...rest } = props;
  return (
    <div className={classnames(styles.card, className)} {...rest}>
      {children}
    </div>
  );
}
