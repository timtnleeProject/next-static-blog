import React, { memo } from "react";
import classnames from "classnames";
import styles from "./styles/Ads.module.scss";

export default memo(function Ads(props) {
  return (
    <iframe
      className={classnames(styles.ads, props.className)}
      src={props.src}
      width="100%"
      onLoad={(e) => {
        const obj = e.target;
        obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + "px";
        obj.contentWindow.document.body.style = "overflow: hidden";
      }}
      scrolling="false"
      frameBorder="0"
    />
  );
});
