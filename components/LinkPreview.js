import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles/LinkPreview.module.scss";
import classnames from "classnames";

export default function LinkPreview(props) {
  const { href, target } = props;
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(function (e) {
      console.log(e);
    });
    fetch(`/api/link?link=${encodeURI(href)}`)
      .then((res) => res.json())
      .then((res) => {
        setPreview(res);
        setLoading(false);
      });
  }, [href]);

  const { images, title, description = "", url = href } = preview;

  return (
    <a
      href={href}
      target={target}
      className={classnames(styles.preview, loading && styles.loading)}
    >
      <span className={styles.title}>{title}</span>
      <span className={styles.url}>{url}</span>
      <span className={styles.img}>
        <canvas width="1" height="1" />
        {images?.length > 0 && <img src={images[0]} alt={href} />}
      </span>
      <span className={styles.description}>{description}</span>
    </a>
  );
}
