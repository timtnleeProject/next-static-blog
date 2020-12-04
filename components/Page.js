import classnames from "classnames";
import styles from "./styles/Page.module.scss";

const Content = (props) => {
  const { children, className, size = "md", ...rest } = props;
  return (
    <div className={classnames(styles.content, styles[size], className)} {...rest}>
      {children}
    </div>
  );
};

export default {
  Content,
};
