import React, { memo } from "react";
import classnames from "classnames";
import styles from "./styles/AdsFrame.module.scss";

export default memo(function Ads(props) {
  return process.env.NODE_ENV === "development" ? (
    "test"
  ) : (
    <div className={classnames(styles.ads, props.className)}>
      <iframe
        className={styles.frame}
        src={props.src}
        onLoad={(e) => {
          const obj = e.target;
          const h = obj.contentWindow.document.documentElement.scrollHeight;
          obj.style.height = (h > 100 ? h : 0) + "px";
          obj.classList.add(styles.show);
          obj.contentWindow.document.body.style = "overflow: hidden";
        }}
        scrolling="false"
        frameBorder="0"
      />
    </div>
  );
});
