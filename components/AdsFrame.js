import React, { memo } from "react";
import classnames from "classnames";
import styles from "./styles/AdsFrame.module.scss";

export default memo(function Ads(props) {
  return (
    <div className={styles.ads}>
      <iframe
        className={classnames(styles.frame, props.className)}
        src={props.src}
        onLoad={(e) => {
          const obj = e.target;
          const h = obj.contentWindow.document.documentElement.scrollHeight;
          obj.style.height = (h > 100 ? h : 0) + "px";
          console.log("LOADED", h);
          obj.classList.add(styles.show);
          obj.contentWindow.document.body.style = "overflow: hidden";
        }}
        scrolling="false"
        frameBorder="0"
      />
    </div>
  );
});
