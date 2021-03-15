import React, { memo } from "react";
import styles from "./styles/Card.module.scss";
import classnames from "classnames";

export default memo(function Card(props) {
  const { children, className, as = "div", ...rest } = props;
  const Component = (props) => React.createElement(as, props);
  return (
    <Component className={classnames(styles.card, className)} {...rest}>
      {children}
    </Component>
  );
});

export function CardTitle(props) {
  const { children, className, as = "h2", ...rest } = props;
  const Component = (props) => React.createElement(as, props);
  return (
    <Component className={classnames(styles.card_title, className)} {...rest}>
      {children}
    </Component>
  );
}
