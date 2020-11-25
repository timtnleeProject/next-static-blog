import styles from "./styles/Center.module.scss";
import classnames from "classnames";

export default function Center(props) {
  const { children, className, ...rest } = props;
  return (
    <div className={classnames(styles.center, className)} {...rest}>
      {children}
    </div>
  );
}
