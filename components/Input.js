import React, { forwardRef } from "react";
import classnames from "classnames";
import styles from "./styles/Input.module.scss";

export default forwardRef(function Input(props, ref) {
  const { className, ...rest } = props;
  return <input ref={ref} className={classnames(styles.input, className)} {...rest} />;
});
