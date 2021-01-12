import classnames from "classnames";
import styles from "./styles/Page.module.scss";

export const Title = (props) => {
  const { children, className, ...rest } = props;
  return (
    <h1 className={classnames(styles.title, className)} {...rest}>
      {children}
    </h1>
  );
};

export const Content = (props) => {
  const { children, className, size = "md", innerRef, ...rest } = props;
  return (
    <div
      ref={innerRef}
      className={classnames(styles.content, styles[size], className)}
      {...rest}
    >
      {children}
    </div>
  );
};

export default {
  Title,
  Content,
};
