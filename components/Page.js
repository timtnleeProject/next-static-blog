import React from "react";
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

export const SubTitle = (props) => {
  const { children, className, ...rest } = props;
  return (
    <h2 className={classnames(styles.title, className)} {...rest}>
      {children}
    </h2>
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

export const CenterSection = (props) => {
  const { as = "div", className, innerRef } = props;
  return React.createElement(
    as,
    {
      ref: innerRef,
      className: classnames(styles.centerSection, className),
    },
    props.children,
  );
};

export default {
  Title,
  SubTitle,
  Content,
  CenterSection,
};
